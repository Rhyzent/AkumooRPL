import { Link } from "react-router-dom";
import logoAkumoo from "@/assets/logo-akumoo.png";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 group ${className}`} aria-label="Akumoo Bowl & Grill home">
    <img
      src={logoAkumoo}
      alt="Akumoo Bowl & Grill"
      width={36}
      height={36}
      className="h-9 w-9 rounded-full object-contain bg-background shadow-card transition-transform group-hover:rotate-[-6deg]"
    />
    <span className="font-display text-2xl font-semibold tracking-tight">Akumoo</span>
  </Link>
);
