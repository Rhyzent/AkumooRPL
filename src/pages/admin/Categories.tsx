import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Cat { id: string; name: string; slug: string; sort_order: number; }

const Categories = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCats((data ?? []) as Cat[]);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("categories").insert({ name, slug, sort_order: cats.length + 1 });
    if (error) return toast.error(error.message);
    setName(""); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Hapus kategori?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Kategori</h1>
        <p className="text-sm text-muted-foreground">Kelola kategori menu</p>
      </div>
      <form onSubmit={add} className="flex gap-2 rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Nama kategori baru</Label>
          <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Mis. Minuman" />
        </div>
        <Button type="submit" variant="hero" className="self-end"><Plus /> Tambah</Button>
      </form>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
        {cats.map(c => (
          <li key={c.id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.slug}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
