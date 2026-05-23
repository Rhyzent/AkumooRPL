import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

const Login = () => {
  const { signIn, signUp, user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.rpc("admin_exists").then(({ data }) => {
      const exists = !!data;
      setAdminExists(exists);
      if (exists) setMode("login");
    });
  }, []);

  useEffect(() => {
    if (!loading && user && isAdmin) nav("/admin", { replace: true });
  }, [user, isAdmin, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      if (adminExists) return toast.error("Pendaftaran admin ditutup. Hubungi admin yang sudah ada.");
      if (password !== confirmPassword) return toast.error("Konfirmasi password tidak cocok");
    }
    setBusy(true);
    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    
    if (error) {
      setBusy(false);
      return toast.error(error);
    }
    
    if (mode === "signup") {
      setBusy(false);
      toast.success("Akun admin pertama dibuat. Silakan login.");
      setMode("login");
      setAdminExists(true);
      setPassword("");
      setConfirmPassword("");
    } else {
      // Untuk login, tunggu hingga auth state ter-update
      // useEffect di atas akan handle redirect otomatis
      // Tambah delay kecil untuk memastikan Supabase state ter-update
      const checkAuthState = () => {
        if (user && isAdmin) {
          setBusy(false);
          toast.success("Berhasil masuk");
          // Redirect akan ditangani oleh useEffect
        } else {
          setTimeout(checkAuthState, 100);
        }
      };
      setTimeout(checkAuthState, 100);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-soft p-6">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Panel</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label>Konfirmasi Password</Label>
              <Input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          )}
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>
            {busy ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          {adminExists === false && mode === "login" && (
            <div className="mb-2 rounded-lg bg-primary/10 p-2 text-xs text-primary">
              Belum ada admin. Daftarkan akun pertama untuk menjadi admin.
            </div>
          )}
          {mode === "login" ? (
            adminExists === false ? (
              <>Belum punya akun?{" "}<button type="button" className="font-semibold text-primary" onClick={() => setMode("signup")}>Daftar admin pertama</button></>
            ) : (
              <span className="text-xs">Pendaftaran admin baru ditutup. Hubungi admin yang sudah ada.</span>
            )
          ) : (
            <>Sudah punya akun?{" "}<button type="button" className="font-semibold text-primary" onClick={() => setMode("login")}>Masuk</button></>
          )}
        </div>
        <div className="text-center text-xs">
          <Link to="/" className="text-muted-foreground hover:text-foreground">← Kembali ke website</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
