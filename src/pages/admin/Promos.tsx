import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Promo { id: string; title: string; description: string | null; image_url: string | null; is_active: boolean; }
const empty = { title: "", description: "", image_url: "", is_active: true };

const Promos = () => {
  const [list, setList] = useState<Promo[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("promos").select("*").order("created_at", { ascending: false });
    setList((data ?? []) as Promo[]);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, description: form.description || null, image_url: form.image_url || null };
    const { error } = editId
      ? await supabase.from("promos").update(payload).eq("id", editId)
      : await supabase.from("promos").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Tersimpan"); setOpen(false); setForm(empty); setEditId(null); load();
  };
  const startEdit = (p: Promo) => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description ?? "", image_url: p.image_url ?? "", is_active: p.is_active });
    setOpen(true);
  };
  const remove = async (id: string) => {
    if (!confirm("Hapus promo?")) return;
    const { error } = await supabase.from("promos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">Promo</h1>
          <p className="text-sm text-muted-foreground">Kelola banner promo Akumoo</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditId(null); setForm(empty); } }}>
          <DialogTrigger asChild><Button variant="hero"><Plus /> Tambah Promo</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit Promo" : "Tambah Promo"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div className="space-y-1.5"><Label>Judul</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Gambar</Label><ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="promos" /></div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label>Aktif</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              </div>
              <Button type="submit" variant="hero" className="w-full">Simpan</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map(p => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
            {p.image_url && <img src={p.image_url} alt={p.title} className="mb-3 aspect-video w-full rounded-xl object-cover" />}
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl">{p.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                {!p.is_active && <span className="mt-2 inline-block text-xs text-muted-foreground">Nonaktif</span>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground">Belum ada promo.</p>}
      </div>
    </div>
  );
};

export default Promos;
