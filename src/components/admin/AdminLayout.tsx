import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Tag, Megaphone, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Pesanan", icon: ShoppingBag },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/categories", label: "Kategori", icon: Tag },
  { to: "/admin/promos", label: "Promo", icon: Megaphone },
  { to: "/admin/admins", label: "Admin", icon: Shield },
];

export const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  useOrderNotifications(!!user && !!isAdmin);

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Memuat...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
          <h1 className="font-display text-2xl">Akses ditolak</h1>
          <p className="text-sm text-muted-foreground">
            Akun Anda belum memiliki role <code className="rounded bg-muted px-1">admin</code>. Hubungi pengelola atau tambahkan role di database.
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => nav("/")}>Ke Website</Button>
            <Button variant="hero" onClick={async () => { await signOut(); nav("/admin/login"); }}>Logout</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-6"><Logo /></div>
        <nav className="flex-1 space-y-1 p-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-foreground text-background" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground")
              }
            >
              <l.icon className="h-4 w-4" />{l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 truncate text-xs text-muted-foreground">{user.email}</div>
          <Button variant="outline" className="w-full" onClick={async () => { await signOut(); nav("/admin/login"); }}>
            <LogOut /> Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <Logo />
          <Button size="sm" variant="outline" onClick={async () => { await signOut(); nav("/admin/login"); }}><LogOut /></Button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                  isActive ? "bg-foreground text-background" : "text-foreground/70")
              }
            >{l.label}</NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
