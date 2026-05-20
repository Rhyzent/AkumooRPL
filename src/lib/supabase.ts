// Custom Supabase client pointing to user's private Supabase project.
// This overrides the auto-generated Lovable Cloud client.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = "https://anyngbrfcqsybfsvyyqp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueW5nYnJmY3FzeWJmc3Z5eXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4ODQ2MzgsImV4cCI6MjA5NDQ2MDYzOH0.527SmBkvxIQ1QA1xzoLlqP0wQOAyHjsICS8v18uRQUg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SUPABASE_PROJECT_URL = SUPABASE_URL;
