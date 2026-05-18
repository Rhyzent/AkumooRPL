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
        supabase
          .from("menu_items")
          .select("id,name,description,price,discount_price,image_url,badge,category_id,is_active,slug,sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
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
        discountPrice: m.discount_price != null ? Number(m.discount_price) : null,
        image: m.image_url || "/placeholder.svg",
        category: (catMap.get(m.category_id) as any) || "Lainnya",
        badge: m.badge ?? undefined,
      }));

      // Use DB items as source of truth. Fallback to static only if DB is empty.
      const merged = dbItems.length > 0 ? dbItems : staticMenu;

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
