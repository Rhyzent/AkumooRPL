import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Phone, Star, Utensils, Truck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuCard } from "@/components/MenuCard";
import { useShopData } from "@/hooks/useShopData";
import { useSEO } from "@/hooks/useSEO";
import heroImg from "@/assets/katsu-bento.jpeg";

const Index = () => {
  const { items } = useShopData();
  const featured = items.slice(0, 3);
  const waUrl = "https://api.whatsapp.com/send?phone=6287781424890&text=Halo%20kak%20aku%20mau%20pesan%20Akumoo%20%F0%9F%8D%B1";

  useSEO({
    title: "Akumoo Bowl & Grill — Bento ala Rumahan Cita Rasa Jepang | Bogor",
    description: "Bento, Geprek, sarapan hemat & cemilan cita rasa Jepang. Disajikan fresh tiap hari di Bogor Barat. Pesan online, antar sampai rumah.",
    canonical: typeof window !== "undefined" ? window.location.origin + "/" : "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Akumoo Bowl & Grill",
      image: typeof window !== "undefined" ? window.location.origin + "/placeholder.svg" : undefined,
      servesCuisine: ["Japanese", "Indonesian"],
      priceRange: "$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Babakan Lb. No.5, Balungbangjaya",
        addressLocality: "Bogor Barat",
        addressCountry: "ID",
      },
      telephone: "+6287781424890",
      openingHours: "Mo-Su 06:30-09:00",
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-12 md:py-24 lg:gap-16">
          <div className="md:col-span-6 space-y-7 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" /> Stand sarapan · 06.30 – 09.00 (samping Alfamidi Bara)
            </span>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Bento ala rumahan,<br />
              <span className="italic text-primary">cita rasa</span> Jepang.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Akumoo Bowl &amp; Grill menyajikan Bento, Geprek, menu sarapan hemat, dan cemilan favorit.
              Lembut, nyaman, dan disajikan fresh setiap hari di Bogor Barat.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/pemesanan">
                  Pesan Sekarang <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/menu">Lihat Menu</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="ml-1 text-sm font-medium">Fresh tiap hari</span>
              </div>
              <span className="text-sm text-muted-foreground">Bento · Geprek · Sarapan · Cemilan</span>
            </div>
          </div>

          <div className="relative md:col-span-6 animate-scale-in">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-soft">
              <img
                src={heroImg}
                alt="Hidangan ayam bakar khas Akumoo dengan sambal dan lalapan"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card p-5 shadow-card md:block animate-fade-up [animation-delay:300ms]">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold">Fresh harian</div>
                  <div className="text-xs text-muted-foreground">Disajikan hangat setiap pesanan</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-10 hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-glow md:block animate-fade-up [animation-delay:500ms]">
              <div className="font-display text-xl font-semibold">Gratis ongkir</div>
              <div className="text-xs opacity-90">Bara · Bateng · Balio · Balebak</div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="container grid gap-8 py-12 md:grid-cols-3">
          {[
            { icon: Utensils, title: "Cita Rasa Jepang", desc: "Bento lembut & nyaman, dibuat fresh" },
            { icon: Truck, title: "Delivery & Catering", desc: "Gratis ongkir Bara, Bateng, Balio, Balebak" },
            { icon: Heart, title: "Stand Sarapan Hemat", desc: "Buka 06.30 – 09.00 di samping Alfamidi Bara" },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl">{f.title}</div>
                <div className="text-sm text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED MENU */}
      <section className="container py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Menu Pilihan</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Yang lagi jadi favorit</h2>
          </div>
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/menu">Lihat semua <ArrowRight /></Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* INFO / KONTAK */}
      <section className="container pb-24">
        <div className="overflow-hidden rounded-3xl bg-foreground text-background">
          <div className="grid md:grid-cols-2">
            <div className="space-y-6 p-10 md:p-14">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-glow">Kunjungi Kami</span>
              <h2 className="font-display text-4xl md:text-5xl">Mampir, ngobrol,<br /> dan makan bareng.</h2>
              <ul className="space-y-4 pt-2 text-background/85">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-glow" />
                  <div>
                    <div className="font-medium text-background">Lokasi</div>
                    <div className="text-sm">Jl. Babakan Lb. No.5, Balungbangjaya, Bogor Barat</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary-glow" />
                  <div>
                    <div className="font-medium text-background">Stand Sarapan</div>
                    <div className="text-sm">Setiap hari · 06.30 – 09.00 (samping Alfamidi Bara Dramaga)</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary-glow" />
                  <div>
                    <div className="font-medium text-background">WhatsApp</div>
                    <div className="text-sm">+62 877-8142-4890</div>
                  </div>
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="hero">
                  <Link to="/pemesanan">Pesan via Website</Link>
                </Button>
                <Button asChild variant="outline" className="border-background/30 text-background hover:bg-background/10 hover:border-background/50">
                  <a href={waUrl} target="_blank" rel="noreferrer">Chat WhatsApp</a>
                </Button>
              </div>
            </div>
            <div className="relative min-h-[320px] bg-secondary/20">
              <iframe
                title="Lokasi Akumoo di Google Maps"
                src="https://www.google.com/maps?q=Jl.+Babakan+Lb.+No.5,+Balungbangjaya,+Bogor+Barat&output=embed"
                className="absolute inset-0 h-full w-full grayscale"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
