import { useMemo, useState } from "react";
import { Search, ArrowDownUp } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useShopData } from "@/hooks/useShopData";
import { useSEO } from "@/hooks/useSEO";

type SortKey = "default" | "price-asc" | "price-desc" | "name";

const Menu = () => {
  const { items, categories: dbCats } = useShopData();
  const categories = ["Semua", ...dbCats];
  const [active, setActive] = useState<string>("Semua");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");

  useSEO({
    title: "Menu & Paket — Bento, Geprek, Sarapan | Akumoo",
    description: "Lihat semua menu Akumoo: Bento crispy, Geprek pedas, sarapan hemat mulai Rp 10.000, dan cemilan. Pesan online sekarang.",
    canonical: typeof window !== "undefined" ? window.location.origin + "/menu" : "/menu",
  });

  const filtered = useMemo(() => {
    const list = items.filter((m) => {
      const matchCat = active === "Semua" || m.category === active;
      const matchQ = m.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [active, query, items, sort]);

  return (
    <>
      <section className="border-b border-border/60 bg-gradient-soft">
        <div className="container py-16 md:py-20">
          <div className="max-w-2xl space-y-5 animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Menu & Paket</span>
            <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
              Bento ala rumahan, <br /><span className="italic">cita rasa Jepang.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Pilih Bento, Geprek, menu sarapan hemat, atau cemilan favorit.
              Semua disajikan fresh setiap hari, dibuat dengan hati.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12">
        {/* FILTER BAR */}
        <div className="sticky top-16 z-30 -mx-4 mb-10 border-y border-border/60 bg-background/85 px-4 py-4 backdrop-blur-lg md:rounded-2xl md:border md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active === c
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/70 hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex w-full gap-2 md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari menu..."
                  className="rounded-full border-border/60 bg-card pl-9"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-auto shrink-0 gap-2 rounded-full border-border/60 bg-card">
                  <ArrowDownUp className="h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Urut: Default</SelectItem>
                  <SelectItem value="price-asc">Harga: Terendah</SelectItem>
                  <SelectItem value="price-desc">Harga: Tertinggi</SelectItem>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border py-24 text-center">
            <p className="font-display text-2xl">Tidak ada menu yang cocok</p>
            <p className="mt-1 text-sm text-muted-foreground">Coba kata kunci atau kategori lain.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Menu;
