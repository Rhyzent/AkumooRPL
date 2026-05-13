import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatRp } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";

type Status = "baru" | "diproses" | "selesai" | "dibatalkan";
interface Order {
  id: string; order_code: string; customer_name: string; customer_phone: string;
  address: string | null; notes: string | null; delivery: string; payment: string;
  subtotal: number; shipping_fee: number; total: number; status: Status; created_at: string;
}
interface Item { id: string; name: string; qty: number; price: number; }

const statusColor: Record<Status, string> = {
  baru: "bg-primary/15 text-primary",
  diproses: "bg-accent/15 text-accent",
  selesai: "bg-emerald-500/15 text-emerald-700",
  dibatalkan: "bg-destructive/10 text-destructive",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string) => {
    if (open === id) { setOpen(null); return; }
    setOpen(id);
    if (!items[id]) {
      const { data } = await supabase.from("order_items").select("id,name,qty,price").eq("order_id", id);
      setItems(p => ({ ...p, [id]: (data ?? []) as Item[] }));
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status diperbarui");
    setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus pesanan ini?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Pesanan dihapus");
    setOrders(p => p.filter(o => o.id !== id));
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Pesanan</h1>
          <p className="text-sm text-muted-foreground">Kelola pesanan masuk dari website</p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem value="baru">Baru</SelectItem>
            <SelectItem value="diproses">Diproses</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
            <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Belum ada pesanan.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map(o => (
              <li key={o.id} className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => toggle(o.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted">
                    {open === o.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-semibold">{o.customer_name} <span className="ml-2 text-xs text-muted-foreground">{o.order_code}</span></div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("id-ID")} · {o.customer_phone} · {o.delivery} · {o.payment}
                    </div>
                  </div>
                  <div className="font-display text-lg">{formatRp(Number(o.total))}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status]}`}>{o.status}</span>
                  <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as Status)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baru">Baru</SelectItem>
                      <SelectItem value="diproses">Diproses</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => remove(o.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
                {open === o.id && (
                  <div className="mt-4 ml-11 space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
                    {o.address && <div><span className="text-muted-foreground">Alamat:</span> {o.address}</div>}
                    {o.notes && <div><span className="text-muted-foreground">Catatan:</span> {o.notes}</div>}
                    <div className="border-t border-border pt-2">
                      {items[o.id]?.map(i => (
                        <div key={i.id} className="flex justify-between py-0.5">
                          <span>{i.qty}× {i.name}</span>
                          <span>{formatRp(Number(i.price) * i.qty)}</span>
                        </div>
                      )) ?? <p className="text-muted-foreground">Memuat...</p>}
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-xs">
                      <span>Subtotal {formatRp(Number(o.subtotal))} + Ongkir {formatRp(Number(o.shipping_fee))}</span>
                      <span className="font-semibold">Total {formatRp(Number(o.total))}</span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Orders;
