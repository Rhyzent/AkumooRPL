import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, MessageCircle, Home, Receipt, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRp } from "@/data/menu";

interface OrderState {
  orderId: string;
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number;
  ongkir: number;
  total: number;
  delivery: "dikirim" | "diambil";
  payment: "transfer" | "cod";
  nama: string;
  hp: string;
  alamat: string;
  catatan: string;
}

const Konfirmasi = () => {
  const { state } = useLocation();
  const order = state as OrderState | null;

  if (!order) return <Navigate to="/pemesanan" replace />;

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Success header */}
        <div className="overflow-hidden rounded-3xl bg-gradient-warm p-8 text-primary-foreground shadow-glow md:p-12 animate-scale-in">
          <div className="flex items-start gap-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary-foreground/15 backdrop-blur">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl leading-tight md:text-5xl">Pesanan berhasil dibuat!</h1>
              <p className="mt-3 max-w-lg text-primary-foreground/85">
                Terima kasih, {order.nama.split(" ")[0]}! Tim Akumoo akan menghubungi via WhatsApp untuk
                konfirmasi pesananmu dalam beberapa menit.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm backdrop-blur">
                <Receipt className="h-4 w-4" /> No. Pesanan · <span className="font-semibold">{order.orderId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail card */}
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-card md:p-10 animate-fade-up">
          <h2 className="font-display text-2xl">Ringkasan</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <InfoBlock icon={MapPin} title={order.delivery === "dikirim" ? "Diantar ke" : "Ambil sendiri"}>
              {order.delivery === "dikirim" ? (
                <p className="text-sm text-muted-foreground">{order.alamat}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Outlet Akumoo · Jl. Babakan Lb. No.5, Balungbangjaya, Bogor Barat</p>
              )}
              <p className="mt-1 text-sm">a.n. <span className="font-medium">{order.nama}</span> · {order.hp}</p>
            </InfoBlock>
            <InfoBlock icon={CreditCard} title="Pembayaran">
              <p className="text-sm font-medium">
                {order.payment === "transfer" ? "Transfer Bank" : "Bayar di tempat (COD)"}
              </p>
              {order.payment === "transfer" && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Transfer ke <span className="font-medium text-foreground">BCA 1234567890</span> a.n. Akumoo
                </p>
              )}
            </InfoBlock>
          </div>

          {order.catatan && (
            <div className="mt-6 rounded-2xl bg-secondary p-4 text-sm">
              <span className="font-medium">Catatan:</span> <span className="text-muted-foreground">{order.catatan}</span>
            </div>
          )}

          <div className="mt-8">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item Pesanan</h3>
            <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-background">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.qty} × {formatRp(it.price)}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatRp(it.qty * it.price)}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl bg-secondary/50 p-5 text-sm">
            <Row label="Subtotal" value={formatRp(order.subtotal)} />
            <Row label="Ongkos kirim" value={formatRp(order.ongkir)} />
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="font-medium">Total dibayar</span>
              <span className="font-display text-3xl font-semibold">{formatRp(order.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <a
                href={`https://api.whatsapp.com/send?phone=6287781424890&text=${encodeURIComponent(
                  `Halo kak, saya ${order.nama} mau konfirmasi pesanan Akumoo ${order.orderId}. Total ${formatRp(order.total)} 🍱`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle /> Konfirmasi via WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/"><Home /> Kembali ke Beranda</Link>
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Butuh bantuan? Hubungi kami di +62 877-8142-4890.
        </p>
      </div>
    </section>
  );
};

const InfoBlock = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border/60 bg-background p-5">
    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
      <Icon className="h-4 w-4" /> {title}
    </div>
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-muted-foreground">
    <span>{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default Konfirmasi;
