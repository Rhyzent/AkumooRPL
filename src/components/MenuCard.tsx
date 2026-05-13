import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { type MenuItem, formatRp } from "@/data/menu";
import { Button } from "./ui/button";

export const MenuCard = ({ item }: { item: MenuItem }) => (
  <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
    <div className="relative aspect-[5/4] overflow-hidden bg-muted">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        width={800}
        height={640}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {item.badge && (
        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground shadow-card">
          {item.badge}
        </span>
      )}
    </div>
    <div className="flex flex-1 flex-col gap-3 p-5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">{item.category}</span>
      <h3 className="font-display text-xl leading-tight">{item.name}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="font-display text-2xl font-semibold">{formatRp(item.price)}</span>
        <Button asChild size="sm" variant="default">
          <Link to={`/pemesanan?item=${item.id}`} aria-label={`Pesan ${item.name}`}>
            <Plus /> Pesan
          </Link>
        </Button>
      </div>
    </div>
  </article>
);
