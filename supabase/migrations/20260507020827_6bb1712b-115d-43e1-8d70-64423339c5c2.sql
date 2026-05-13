
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create trigger trg_categories_updated before update on public.categories for each row execute function public.set_updated_at();

create policy "Public read categories" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Menu items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  badge text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.menu_items enable row level security;
create trigger trg_menu_items_updated before update on public.menu_items for each row execute function public.set_updated_at();

create policy "Public read active menu" on public.menu_items for select using (is_active = true);
create policy "Admins read all menu" on public.menu_items for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage menu" on public.menu_items for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Promos
create table public.promos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.promos enable row level security;
create trigger trg_promos_updated before update on public.promos for each row execute function public.set_updated_at();

create policy "Public read active promos" on public.promos for select using (is_active = true);
create policy "Admins manage promos" on public.promos for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Orders
create type public.order_status as enum ('baru','diproses','selesai','dibatalkan');
create type public.delivery_method as enum ('dikirim','diambil');
create type public.payment_method as enum ('transfer','cod');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  address text,
  notes text,
  delivery delivery_method not null,
  payment payment_method not null,
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status order_status not null default 'baru',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create trigger trg_orders_updated before update on public.orders for each row execute function public.set_updated_at();

create policy "Public create orders" on public.orders for insert with check (true);
create policy "Admins read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete orders" on public.orders for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Order items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  name text not null,
  price numeric(10,2) not null,
  qty int not null check (qty > 0),
  created_at timestamptz not null default now()
);
alter table public.order_items enable row level security;

create policy "Public create order items" on public.order_items for insert with check (true);
create policy "Admins read order items" on public.order_items for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins manage order items" on public.order_items for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create index idx_menu_category on public.menu_items(category_id);
create index idx_order_items_order on public.order_items(order_id);
create index idx_orders_status on public.orders(status);
