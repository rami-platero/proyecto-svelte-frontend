-- Inventario de stock: esquema base.
-- Ejecutar una sola vez en Supabase: SQL Editor -> New query -> Run.
-- Convención: la base de datos está en inglés; los textos de la interfaz, en español.

create table if not exists public.categories (
	id bigint generated always as identity primary key,
	name text not null unique,
	created_at timestamptz not null default now()
);

create table if not exists public.products (
	id bigint generated always as identity primary key,
	sku text not null unique,
	name text not null,
	description text,
	category_id bigint references public.categories (id) on delete set null,
	unit text not null default 'unidad',
	stock integer not null default 0 check (stock >= 0),
	min_stock integer not null default 0 check (min_stock >= 0),
	price numeric(12, 2) not null default 0 check (price >= 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
	id bigint generated always as identity primary key,
	product_id bigint not null references public.products (id) on delete cascade,
	type text not null check (type in ('inbound', 'outbound', 'adjustment')),
	quantity integer not null,
	resulting_stock integer not null,
	reason text,
	created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists stock_movements_product_id_idx on public.stock_movements (product_id);
create index if not exists stock_movements_created_at_idx on public.stock_movements (created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at := now();
	return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
	before update on public.products
	for each row
	execute function public.touch_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;

alter table public.categories replica identity full;
alter table public.products replica identity full;
alter table public.stock_movements replica identity full;

drop policy if exists "categories public select" on public.categories;
create policy "categories public select" on public.categories for select using (true);
drop policy if exists "categories public insert" on public.categories;
create policy "categories public insert" on public.categories for insert with check (true);
drop policy if exists "categories public update" on public.categories;
create policy "categories public update" on public.categories for update using (true);
drop policy if exists "categories public delete" on public.categories;
create policy "categories public delete" on public.categories for delete using (true);

drop policy if exists "products public select" on public.products;
create policy "products public select" on public.products for select using (true);
drop policy if exists "products public insert" on public.products;
create policy "products public insert" on public.products for insert with check (true);
drop policy if exists "products public update" on public.products;
create policy "products public update" on public.products for update using (true);
drop policy if exists "products public delete" on public.products;
create policy "products public delete" on public.products for delete using (true);

drop policy if exists "movements public select" on public.stock_movements;
create policy "movements public select" on public.stock_movements for select using (true);
drop policy if exists "movements public insert" on public.stock_movements;
create policy "movements public insert" on public.stock_movements for insert with check (true);

do $$
begin
	if not exists (
		select 1 from pg_publication_tables
		where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
	) then
		alter publication supabase_realtime add table public.products;
	end if;

	if not exists (
		select 1 from pg_publication_tables
		where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'stock_movements'
	) then
		alter publication supabase_realtime add table public.stock_movements;
	end if;
end
$$;
