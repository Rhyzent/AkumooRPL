import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Users } from "lucide-react";

interface AdminItem {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const Admins = () => {
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const res = await fetch(`${VITE_SUPABASE_URL}/functions/v1/list-admins`, {
        method: "GET",
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAdmins(data.admins || []);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat daftar admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email dan password wajib diisi");
    setAdding(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const res = await fetch(`${VITE_SUPABASE_URL}/functions/v1/create-admin`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Admin baru berhasil ditambahkan");
      setEmail("");
      setPassword("");
      setShowForm(false);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan admin");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm("Yakin ingin menghapus admin ini?")) return;
    try {
      const { error } = await supabase.from("user_roles").delete().eq("id", adminId);
      if (error) throw error;
      toast.success("Admin dihapus");
      setAdmins((prev) => prev.filter((a) => a.id !== adminId));
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus admin");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Kelola Admin</h1>
        <Button variant="hero" onClick={() => setShowForm((s) => !s)}>
          <Plus className="mr-2 h-4 w-4" /> {showForm ? "Batal" : "Tambah Admin"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tambah Admin Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={adding}>
                  {adding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Simpan
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" /> Daftar Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Memuat...</div>
          ) : admins.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Belum ada admin</div>
          ) : (
            <div className="space-y-2">
              {admins.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.email}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.user_id}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(a.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admins;
