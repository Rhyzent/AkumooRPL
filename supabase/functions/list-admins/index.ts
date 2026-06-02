import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    if (!token) throw new Error("Unauthorized");

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    console.log("Auth check - User ID:", user?.id, "Error:", authError);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: roleCheck, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    
    console.log("Role check - Data:", roleCheck, "Error:", roleError);
    
    if (roleError) throw new Error(`Database error: ${roleError.message}`);
    if (!roleCheck) throw new Error("Forbidden: admin only");

    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("id,user_id,created_at")
      .eq("role", "admin");

    const userIds = roles?.map((r) => r.user_id) || [];
    let adminEmails: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const users = listData?.users || [];
      for (const u of users) {
        if (userIds.includes(u.id)) {
          adminEmails[u.id] = u.email || "-";
        }
      }
    }

    const admins = (roles || []).map((r) => ({
      id: r.id,
      user_id: r.user_id,
      email: adminEmails[r.user_id] || "-",
      created_at: r.created_at,
    }));

    return new Response(
      JSON.stringify({ admins }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Error in list-admins:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
