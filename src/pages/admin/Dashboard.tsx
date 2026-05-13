import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Wallet, Clock, TrendingUp, RefreshCw } from "lucide-react";
import { formatRp } from "@/data/menu";
import { Button } from "@/components/ui/button";

interface OrderRow { total: number; status: string; created_at: string; }
interface ItemRow { name: string; qty: number; }

const Dashboard = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: o }, { data: i }] = await Promise.all([
      supabase.from("orders").select("total,status,created_at").order("created_at", { ascending: false }),
      supabase.from("order_items").select("name,qty"),
    ]);
    setOrders((o ?? []) as OrderRow[]);
    setItems((i ?? []) as ItemRow[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.created_at) >= today);
    const totalRevenue = orders.filter(o => o.status !== "dibatalkan").reduce((a, b) => a + Number(b.total), 0);
    const todayRevenue = todayOrders.filter(o => o.status !== "dibatalkan").reduce((a, b) => a + Number(b.total), 0);
    const pending = orders.filter(o => o.status === "baru").length;

    // last 7 days
    const days: { label: string; count: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const dayOrders = orders.filter(o => {
        const t = new Date(o.created_at);
        return t >= d && t < next;
      });
      days.push({
        label: d.toLocaleDateString("id-ID", { weekday: "short" }),
        count: dayOrders.length,
        revenue: dayOrders.filter(o => o.status !== "dibatalkan").reduce((a, b) => a + Number(b.total), 0),
      });
    }

    const map = new Map<string, number>();
    items.forEach(i => map.set(i.name, (map.get(i.name) ?? 0) + i.qty));
    const topItems = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalRevenue, todayRevenue, pending, days, topItems,
    };
  }, [orders, items]);

  const maxCount = Math.max(1, ...stats.days.map(d => d.count));

  const cards = [
    { label: "Pesanan Hari Ini", value: stats.todayOrders, icon: ShoppingBag, sub: `${stats.totalOrders} total` },
    { label: "Omzet Hari Ini", value: formatRp(stats.todayRevenue), icon: Wallet, sub: `${formatRp(stats.totalRevenue)} total` },
    { label: "Perlu Diproses", value: stats.pending, icon: Clock, sub: "Status: baru" },
    { label: "Status Live", value: loading ? "Memuat..." : "Aktif", icon: TrendingUp, sub: "Update real-time" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Ringkasan performa Akumoo</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 font-display text-2xl">{c.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl">Pesanan 7 Hari Terakhir</h2>
            <span className="text-xs text-muted-foreground">{stats.days.reduce((a, b) => a + b.count, 0)} pesanan</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {stats.days.map((d, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all group-hover:bg-primary"
                    style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? "4px" : "2px" }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100">
                      {d.count} · {formatRp(d.revenue)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl">Menu Terlaris</h2>
          {stats.topItems.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Belum ada data pesanan.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {stats.topItems.map((t, i) => (
                <li key={t.name} className="flex items-center justify-between py-2 text-sm">
                  <span className="truncate"><span className="mr-2 text-muted-foreground">#{i + 1}</span>{t.name}</span>
                  <span className="ml-2 shrink-0 font-semibold">{t.qty}×</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
