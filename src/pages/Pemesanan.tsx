import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { formatRp } from "@/data/menu";
import { useShopData } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Cart = Record<string, number>;

const Pemesanan = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { items: menuItems } = useShopData();
  const preselect = params.get("item");

  const [cart, setCart] = useState<Cart>({});
  useEffect(() => {
    if (preselect && menuItems.some((m) => m.id === preselect) && !cart[preselect]) {
      setCart((c) => ({ ...c, [preselect]: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems.length]);
  const [delivery, setDelivery] = useState<"dikirim" | "diambil">("dikirim");
  const [payment, setPayment] = useState<"transfer" | "cod">("transfer");
  const [form, setForm] = useState({ nama: "", hp: "", alamat: "", catatan: "" });
  const [touched, setTouched] = useState(false);

  const inc = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  const remove = (id: string) =>
    setCart((c) => {
      const n = { ...c };
      delete n[id];
      return n;
    });

  const subtotal = useMemo(
    () => menuItems.reduce((sum, m) => sum + (cart[m.id] ?? 0) * m.price, 0),
    [cart],
  );
  const ongkir = delivery === "dikirim" && subtotal > 0 ? 8000 : 0;
  const total = subtotal + ongkir;
  const itemsInCart = Object.values(cart).reduce((a, b) => a + b, 0);

  const isValid =
    itemsInCart > 0 &&
    form.nama.trim().length > 1 &&
    form.hp.trim().length >= 9 &&
    (delivery === "diambil" || form.alamat.trim().length > 4);

  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || submitting) return;
    setSubmitting(true);
    const orderId = "AKM-" + Math.floor(100000 + Math.random() * 900000);
    const items = menuItems
      .filter((m) => cart[m.id])
      .map((m) => ({ id: m.id, name: m.name, qty: cart[m.id], price: m.price }));

    // Save to backend (best-effort, still proceed to confirmation)
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        order_code: orderId,
        customer_name: form.nama,
        customer_phone: form.hp,
        address: delivery === "dikirim" ? form.alamat : null,
        notes: form.catatan || null,
        delivery, payment,
        subtotal, shipping_fee: ongkir, total,
      }).select("id").single();
      if (error) throw error;
      if (order) {
        await supabase.from("order_items").insert(
          items.map(i => ({ order_id: order.id, name: i.name, price: i.price, qty: i.qty }))
        );
      }
    } catch (err: any) {
      toast.error("Gagal menyimpan pesanan: " + (err?.message ?? "unknown"));
    }

    setSubmitting(false);
    navigate("/konfirmasi", {
      state: { orderId, items, subtotal, ongkir, total, delivery, payment, ...form },
    });
  };

  return (
    <section className="container py-12 md:py-16">
      <div className="mb-10 max-w-2xl animate-fade-up">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Pemesanan</span>
        <h1 className="mt-2 font-display text-5xl leading-[1.05] md:text-6xl">Atur pesananmu.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Pilih menu, isi data, dan tentukan metode pengiriman. Kami olah dadakan begitu pesanan masuk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
        {/* LEFT: items + form */}
        <div className="space-y-8 lg:col-span-7">
          {/* Step 1: Items */}
          <Section number="1" title="Pilih menu">
            <div className="space-y-3">
              {menuItems.map((m) => {
                const qty = cart[m.id] ?? 0;
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex gap-4 rounded-2xl border bg-card p-3 transition-colors",
                      qty > 0 ? "border-primary/40 bg-primary/[0.03]" : "border-border/60",
                    )}
                  >
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      width={120}
                      height={120}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                    />
                    <div className="flex flex-1 flex-col justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{m.category}</div>
                        <div className="font-display text-base leading-tight sm:text-lg">{m.name}</div>
                        <div className="mt-0.5 text-sm font-semibold">{formatRp(m.price)}</div>
                      </div>
                      <div className="flex items-center justify-end">
                        {qty === 0 ? (
                          <Button type="button" size="sm" variant="outline" onClick={() => inc(m.id)}>
                            <Plus /> Tambah
                          </Button>
                        ) : (
                          <div className="flex items-center gap-1 rounded-full bg-foreground p-1 text-background">
                            <button
                              type="button"
                              onClick={() => dec(m.id)}
                              className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-background/15"
                              aria-label="Kurangi"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                            <button
                              type="button"
                              onClick={() => inc(m.id)}
                              className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-background/15"
                              aria-label="Tambah"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {touched && itemsInCart === 0 && (
                <p className="text-sm font-medium text-destructive">Pilih produk yang ingin dipesan!</p>
              )}
            </div>
          </Section>

          {/* Step 2: Data diri */}
          <Section number="2" title="Data diri">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama Lengkap" required error={touched && !form.nama.trim() ? "Wajib diisi" : ""}>
                <Input
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Mis. Andini Putri"
                />
              </Field>
              <Field label="No. WhatsApp" required error={touched && form.hp.trim().length < 9 ? "Minimal 9 digit" : ""}>
                <Input
                  type="tel"
                  value={form.hp}
                  onChange={(e) => setForm({ ...form, hp: e.target.value.replace(/[^\d+]/g, "") })}
                  placeholder="08xx xxxx xxxx"
                />
              </Field>
            </div>
          </Section>

          {/* Step 3: Delivery */}
          <Section number="3" title="Metode pengiriman">
            <RadioGroup
              value={delivery}
              onValueChange={(v) => setDelivery(v as typeof delivery)}
              className="grid gap-3 sm:grid-cols-2"
            >
              <ChoiceCard value="dikirim" current={delivery} title="Diantar ke alamat" desc="Ongkir Rp 8.000 (radius 3 km)" />
              <ChoiceCard value="diambil" current={delivery} title="Ambil sendiri" desc="Tanpa ongkir, datang ke outlet" />
            </RadioGroup>

            {delivery === "dikirim" && (
              <div className="mt-4">
                <Field label="Alamat lengkap" required error={touched && form.alamat.trim().length < 5 ? "Lengkapi alamat" : ""}>
                  <Textarea
                    rows={3}
                    value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    placeholder="Nama jalan, nomor rumah, patokan, dst."
                  />
                </Field>
              </div>
            )}
            <div className="mt-4">
              <Field label="Catatan untuk dapur (opsional)">
                <Textarea
                  rows={2}
                  value={form.catatan}
                  onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                  placeholder="Mis. tidak pedas, extra sambal, dll."
                />
              </Field>
            </div>
          </Section>

          {/* Step 4: Payment */}
          <Section number="4" title="Metode pembayaran">
            <RadioGroup
              value={payment}
              onValueChange={(v) => setPayment(v as typeof payment)}
              className="grid gap-3 sm:grid-cols-2"
            >
              <ChoiceCard value="transfer" current={payment} title="Transfer Bank" desc="BCA / BRI / Dana / OVO" />
              <ChoiceCard value="cod" current={payment} title="Bayar di tempat (COD)" desc="Tunai saat pesanan tiba" />
            </RadioGroup>
          </Section>
        </div>

        {/* RIGHT: summary */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-4 rounded-3xl border border-border/60 bg-card p-6 shadow-card md:p-8">
            <h2 className="font-display text-2xl">Ringkasan pesanan</h2>

            {itemsInCart === 0 ? (
              <p className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
                Belum ada item. Pilih menu di sebelah kiri untuk mulai.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {menuItems
                  .filter((m) => cart[m.id])
                  .map((m) => (
                    <li key={m.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {cart[m.id]} × {formatRp(m.price)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{formatRp(cart[m.id] * m.price)}</span>
                        <button
                          type="button"
                          onClick={() => remove(m.id)}
                          className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Hapus ${m.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}

            <div className="space-y-2 border-t border-border/60 pt-4 text-sm">
              <Row label="Subtotal" value={formatRp(subtotal)} />
              <Row label={delivery === "dikirim" ? "Ongkos kirim" : "Ambil sendiri"} value={formatRp(ongkir)} />
              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="font-medium">Total</span>
                <span className="font-display text-2xl font-semibold">{formatRp(total)}</span>
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              Konfirmasi Pesanan <ArrowRight />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Dengan mengonfirmasi, kamu setuju kami menghubungi via WhatsApp.
            </p>
          </div>
        </aside>
      </form>
    </section>
  );
};

const Section = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-card md:p-8">
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
        {number}
      </span>
      <h2 className="font-display text-2xl">{title}</h2>
    </div>
    {children}
  </section>
);

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label} {required && <span className="text-primary">*</span>}
    </Label>
    {children}
    {error && <p className="text-xs font-medium text-destructive">{error}</p>}
  </div>
);

const ChoiceCard = ({
  value,
  current,
  title,
  desc,
}: {
  value: string;
  current: string;
  title: string;
  desc: string;
}) => (
  <Label
    htmlFor={`opt-${value}`}
    className={cn(
      "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
      current === value ? "border-primary bg-primary/5" : "border-border/60 hover:border-foreground/30",
    )}
  >
    <RadioGroupItem id={`opt-${value}`} value={value} className="mt-0.5" />
    <div>
      <div className="font-display text-base">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  </Label>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-muted-foreground">
    <span>{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default Pemesanan;
