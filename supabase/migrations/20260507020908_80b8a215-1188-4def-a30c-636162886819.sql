
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

revoke execute on function public.has_role(uuid, app_role) from public, anon;
grant execute on function public.has_role(uuid, app_role) to authenticated;

insert into public.categories (name, slug, sort_order) values
  ('Bento','bento',1),('Geprek','geprek',2),('Sarapan','sarapan',3),('Cemilan','cemilan',4)
on conflict (slug) do nothing;

with c as (select id, slug from public.categories)
insert into public.menu_items (slug, name, description, price, category_id, badge, sort_order) values
  ('katsu-bento','Katsu Bento','Bento ayam katsu crispy dengan saus khas Jepang, nasi pulen, dan pelengkap segar.',24000,(select id from c where slug='bento'),'Best Seller',1),
  ('beef-bento','Beef Bento','Irisan daging sapi gurih bumbu teriyaki, disajikan dengan nasi hangat ala bento Jepang.',25000,(select id from c where slug='bento'),null,2),
  ('karaage-bento','Karaage Bento','Ayam karaage juicy ala Jepang dengan balutan tepung renyah, lengkap dalam satu kotak bento.',24000,(select id from c where slug='bento'),null,3),
  ('katsu-box','Katsu Box','Versi hemat dari Katsu Bento — ayam katsu + nasi dalam kemasan praktis.',18000,(select id from c where slug='bento'),null,4),
  ('karaage-box','Karaage Box','Karaage juicy + nasi hangat dalam ukuran box, pas untuk makan siang cepat.',18000,(select id from c where slug='bento'),null,5),
  ('katsudon-box','Katsudon Box','Katsu disiram saus telur khas katsudon di atas nasi hangat.',21000,(select id from c where slug='bento'),null,6),
  ('geprek-sambal-matah','Ayam Geprek Sambal Matah','Ayam geprek crispy dengan sambal matah segar khas Bali.',17000,(select id from c where slug='geprek'),'Favorit',1),
  ('geprek-sambal-korek','Ayam Geprek Sambal Korek','Ayam geprek dengan sambal korek pedas mantap.',17000,(select id from c where slug='geprek'),null,2),
  ('sarapan-ayam-geprek','Ayam Geprek (Sarapan)','Menu sarapan hemat. Delivery +1K dari harga menu.',10000,(select id from c where slug='sarapan'),'Hemat',1),
  ('sarapan-chicken-katsu','Chicken Katsu (Sarapan)','Chicken katsu hangat untuk sarapan.',10000,(select id from c where slug='sarapan'),null,2),
  ('sarapan-nasgor-sapi','Nasi Goreng Sapi','Nasi goreng sapi gurih untuk awali hari.',11000,(select id from c where slug='sarapan'),null,3),
  ('sarapan-nasgor-sapi-spesial','Nasi Goreng Sapi Spesial','Versi spesial dengan topping tambahan.',12000,(select id from c where slug='sarapan'),null,4),
  ('sarapan-chicken-karaage','Chicken Karaage (Sarapan)','Karaage juicy untuk sarapan.',12000,(select id from c where slug='sarapan'),null,5),
  ('sarapan-nasi-daun-jeruk','Nasi Daun Jeruk Ayam','Nasi wangi daun jeruk dengan ayam gurih.',12000,(select id from c where slug='sarapan'),null,6),
  ('sarapan-salad-buah','Salad Buah','Salad buah segar & menyehatkan.',10000,(select id from c where slug='sarapan'),null,7),
  ('dimsum-goreng-klemer','Dimsum Goreng Klemer','Cemilan dimsum goreng klemer renyah di luar, lembut di dalam.',21000,(select id from c where slug='cemilan'),null,1)
on conflict (slug) do nothing;
