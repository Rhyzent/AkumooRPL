import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatRp } from "@/data/menu";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Cat { id: string; name: string; }
interface Item {
  id: string; name: string; slug: string; description: string | null; price: number;
  discount_price: number | null;
  image_url: string | null; category_id: string | null; badge: string | null; is_active: boolean; sort_order: number;
}

const empty = { name: "", slug: "", description: "", price: 0, discount_price: 0, image_url: "", category_id: "", badge: "", is_active: true, sort_order: 0 };

const MenuAdmin = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);

  const load = async () => {
    const [{ data: m }, { data: c }] = await Promise.all([
      supabase.from("menu_items").select("*").order("sort_order"),
      supabase.from("categories").select("id,name").order("sort_order"),
    ]);
    setItems((m ?? []) as Item[]);
    setCats((c ?? []) as Cat[]);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setEditId(null); setForm(empty); setOpen(true); };
  const startEdit = (i: Item) => {
    setEditId(i.id);
    setForm({
      name: i.name, slug: i.slug, description: i.description ?? "", price: Number(i.price),
      discount_price: i.discount_price != null ? Number(i.discount_price) : 0,
      image_url: i.image_url ?? "", category_id: i.category_id ?? "", badge: i.badge ?? "",
      is_active: i.is_active, sort_order: i.sort_order,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    // Auto-assign sort_order untuk item baru bila masih 0
    let sort_order = form.sort_order;
    if (!editId && (!sort_order || sort_order === 0)) {
      const maxOrder = items.reduce((m, i) => Math.max(m, i.sort_order ?? 0), 0);
      sort_order = maxOrder + 1;
    }
    const payload = {
      ...form,
      sort_order,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category_id: form.category_id || null,
      image_url: form.image_url || null,
      badge: form.badge || null,
      description: form.description || null,
      discount_price: form.discount_price && form.discount_price > 0 ? form.discount_price : null,
    };
    const { error } = editId
      ? await supabase.from("menu_items").update(payload).eq("id", editId)
      : await supabase.from("menu_items").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Tersimpan"); setOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Dihapus"); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">Menu</h1>
          <p className="text-sm text-muted-foreground">Kelola daftar menu Akumoo</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="hero" onClick={startNew}><Plus /> Tambah Menu</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit Menu" : "Tambah Menu"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <Field label="Nama"><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Slug (kosongkan untuk auto)"><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field>
              <Field label="Harga (Rp)"><Input type="number" required min={0} value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></Field>
              <Field label="Harga Diskon (Rp) — kosongkan/0 jika tidak ada diskon"><Input type="number" min={0} value={form.discount_price} onChange={e => setForm({ ...form, discount_price: Number(e.target.value) })} placeholder="0" /></Field>
              <Field label="Kategori">
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                  <SelectContent>{cats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Gambar"><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="menu" /></Field>
              <Field label="Badge (opsional)"><Input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="Best Seller" /></Field>
              <Field label="Deskripsi"><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
              <Field label="Urutan"><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></Field>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label>Aktif</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              </div>
              <Button type="submit" variant="hero" className="w-full">Simpan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map(i => (
          <div key={i.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              {i.image_url && <img src={i.image_url} alt={i.name} className="h-full w-full object-cover" />}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {i.discount_price && Number(i.discount_price) > 0 ? (
                      <>
                        <span className="line-through">{formatRp(Number(i.price))}</span>{" "}
                        <span className="font-semibold text-destructive">{formatRp(Number(i.discount_price))}</span>
                      </>
                    ) : (
                      formatRp(Number(i.price))
                    )} {!i.is_active && "· nonaktif"}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(i)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{i.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>
);

export default MenuAdmin;
