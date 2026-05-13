import { useState } from "react";
import { NavLink as RouterNavLink, Link } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/menu", label: "Menu & Paket" },
  { to: "/tentang", label: "Tentang" },
  { to: "/pemesanan", label: "Pemesanan" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {links.map((l) => (
            <RouterNavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground hover:bg-foreground/5",
                )
              }
            >
              {l.label}
            </RouterNavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild variant="hero" size="default">
            <Link to="/pemesanan">
              <ShoppingBag /> Pesan Sekarang
            </Link>
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background md:hidden animate-fade-in">
          <nav className="container flex flex-col gap-1 py-4" aria-label="Navigasi mobile">
            {links.map((l) => (
              <RouterNavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-3 text-sm font-medium",
                    isActive ? "bg-foreground text-background" : "hover:bg-foreground/5",
                  )
                }
              >
                {l.label}
              </RouterNavLink>
            ))}
            <Button asChild variant="hero" className="mt-2">
              <Link to="/pemesanan" onClick={() => setOpen(false)}>
                <ShoppingBag /> Pesan Sekarang
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
