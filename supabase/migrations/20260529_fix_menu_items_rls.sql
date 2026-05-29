-- Fix menu_items RLS policies
DROP POLICY IF EXISTS "Public read active menu" ON public.menu_items;
DROP POLICY IF EXISTS "Admins read all menu" ON public.menu_items;
DROP POLICY IF EXISTS "Admins manage menu" ON public.menu_items;

-- Public can read active menu items
CREATE POLICY "Public read active menu" ON public.menu_items
  FOR SELECT USING (is_active = true);

-- Admins can read all menu items (active & inactive)
CREATE POLICY "Admins read all menu" ON public.menu_items
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert menu items
CREATE POLICY "Admins insert menu" ON public.menu_items
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update menu items
CREATE POLICY "Admins update menu" ON public.menu_items
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete menu items
CREATE POLICY "Admins delete menu" ON public.menu_items
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));
