import { Link } from "react-router-dom";
import { Heart, Sparkles, MapPin, Clock, Phone, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import katsuBento from "@/assets/katsu-bento.jpeg";

const Tentang = () => {
  useSEO({
    title: "Tentang Akumoo — Cerita di Balik Bento Cita Rasa Jepang",
    description:
      "Akumoo Bowl & Grill lahir dari kecintaan pada bento Jepang yang lembut, hangat, dan ramah di kantong. Kenalan lebih dekat dengan kami.",
    canonical: typeof window !== "undefined" ? window.location.href : "/tentang",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Akumoo Bowl & Grill",
      servesCuisine: ["Japanese", "Indonesian"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Jl. Babakan Lb. No.5, Balungbangjaya",
        addressLocality: "Bogor Barat",
        addressCountry: "ID",
      },
      telephone: "+6287781424890",
      url: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-soft">
        <div className="container grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div className="space-y-5 animate-fade-up">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Cerita Akumoo</span>
            <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
              Bento ala rumahan, <br />
              <span className="italic">disajikan dengan hati.</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Akumoo lahir dari kecintaan kami pada cita rasa Jepang yang hangat dan ramah —
              gurih, lembut, dan bisa dinikmati siapa saja, kapan saja.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="hero" size="lg"><Link to="/menu">Lihat Menu</Link></Button>
              <Button asChild variant="outline" size="lg"><Link to="/pemesanan">Pesan Sekarang</Link></Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={katsuBento}
              alt="Bento Akumoo"
              className="aspect-square w-full rounded-3xl object-cover shadow-soft"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-card md:block">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Sejak</div>
              <div className="font-display text-3xl">2024</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Filosofi Kami</span>
          <h2 className="font-display text-4xl md:text-5xl">Sederhana, jujur, bikin nagih.</h2>
          <p className="text-lg text-muted-foreground">
            Kami percaya makanan enak nggak harus mahal. Tiap kotak bento Akumoo dibuat dadakan dengan
            bumbu segar, takaran konsisten, dan satu prinsip: kalau bukan untuk keluarga sendiri, jangan disajikan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Heart, title: "Dibuat Dengan Hati", desc: "Resep dapur rumahan yang konsisten — diolah saat dipesan." },
            { icon: Sparkles, title: "Bahan Fresh", desc: "Belanja harian, tidak pakai pengawet, langsung disajikan." },
            { icon: MapPin, title: "Lokal Bogor", desc: "Bangga melayani warga Bogor Barat dengan cita rasa yang bersahabat." },
          ].map((v) => (
            <div key={v.title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-card">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/40">
        <div className="container py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Mampir Yuk</span>
              <h2 className="font-display text-4xl md:text-5xl">Sapa kami langsung.</h2>
              <p className="text-muted-foreground">
                Stand sarapan kami buka pagi-pagi. Atau pesan via WhatsApp untuk diantar ke rumah.
              </p>
              <ul className="space-y-3 pt-2 text-sm">
                <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Jl. Babakan Lb. No.5, Balungbangjaya, Bogor Barat</li>
                <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Stand sarapan: 06.30 – 09.00 WIB</li>
                <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> +62 877-8142-4890</li>
                <li className="flex gap-3"><Instagram className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> @akumoo.id</li>
              </ul>
            </div>
            <div className="aspect-video overflow-hidden rounded-3xl border border-border/60 shadow-card">
              <iframe
                title="Lokasi Akumoo"
                src="https://www.google.com/maps?q=Balungbangjaya+Bogor+Barat&output=embed"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tentang;
