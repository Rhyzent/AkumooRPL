import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { menuItems as staticMenu, type MenuItem } from "@/data/menu";

export interface ShopCategory {
  name: string;
  source: "static" | "db";
}

export const useShopData = () => {
  const [items, setItems] = useState<MenuItem[]>(staticMenu);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: cats }, { data: menus }] = await Promise.all([
        supabase.from("categories").select("id,name,sort_order").order("sort_order"),
        supabase.from("menu_items").select("id,name,description,price,image_url,badge,category_id,is_active,slug").eq("is_active", true),
      ]);
      if (!alive) return;

      // Build category id -> name map
      const catMap = new Map<string, string>();
      (cats ?? []).forEach((c: any) => catMap.set(c.id, c.name));

      // DB items mapped to MenuItem shape (image fallback to placeholder)
      const dbItems: MenuItem[] = (menus ?? []).map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description ?? "",
        price: Number(m.price),
        image: m.image_url || "/placeholder.svg",
        category: (catMap.get(m.category_id) as any) || "Lainnya",
        badge: m.badge ?? undefined,
      }));

      // Merge: prefer DB items; append static items whose name not in DB
      const dbNames = new Set(dbItems.map((i) => i.name.toLowerCase()));
      const merged = [
        ...dbItems,
        ...staticMenu.filter((s) => !dbNames.has(s.name.toLowerCase())),
      ];

      // Categories: union of static + db, preserving order
      const staticCats = ["Bento", "Geprek", "Sarapan", "Cemilan"];
      const dbCatNames = (cats ?? []).map((c: any) => c.name as string);
      const all = [...staticCats];
      dbCatNames.forEach((n) => { if (!all.includes(n)) all.push(n); });
      // Also include any category referenced by items but not in lists
      merged.forEach((i) => { if (!all.includes(i.category)) all.push(i.category); });

      setItems(merged);
      setCategories(all);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return { items, categories, loading };
};
