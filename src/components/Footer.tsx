import { Logo } from "./Logo";
import { Instagram, MessageCircle, MapPin, Clock, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-border/60 bg-secondary/40">
    <div className="container grid gap-10 py-14 md:grid-cols-4">
      <div className="md:col-span-2 space-y-4">
        <Logo />
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Akumoo Bowl &amp; Grill — bento ala rumahan dengan cita rasa Jepang yang lembut & nyaman.
          Disajikan fresh setiap hari di Bogor Barat.
        </p>
        <div className="flex gap-3">
          <a href="https://www.instagram.com/akumoo.id" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-foreground hover:text-background">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="https://api.whatsapp.com/send?phone=6287781424890&text=Halo%20kak%20aku%20mau%20pesan%20Akumoo%20%F0%9F%8D%B1" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-foreground hover:text-background">
            <MessageCircle className="h-4 w-4" />
          </a>
          <a href="https://www.tiktok.com/@akumoo.id" target="_blank" rel="noreferrer" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-foreground hover:text-background">
            <span className="text-xs font-bold">TT</span>
          </a>
        </div>
      </div>

      <div>
        <h4 className="mb-4 font-display text-lg">Jelajahi</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground">Beranda</Link></li>
          <li><Link to="/menu" className="hover:text-foreground">Menu & Paket</Link></li>
          <li><Link to="/tentang" className="hover:text-foreground">Tentang Kami</Link></li>
          <li><Link to="/pemesanan" className="hover:text-foreground">Pemesanan</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 font-display text-lg">Kunjungi Kami</h4>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Jl. Babakan Lb. No.5, Balungbangjaya, Bogor Barat</li>
          <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Stand sarapan · 06.30 – 09.00</li>
          <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> +62 877-8142-4890</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Akumoo. Wireframe prototype – Praktikum RPL.
    </div>
  </footer>
);
