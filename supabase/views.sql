-- Vistas de lectura: aplanan los joins y calculan en la base lo que antes se
-- calculaba en el navegador, para poder filtrar, ordenar y paginar del lado
-- del servidor.
--
-- Ejecutar DESPUÉS de schema.sql y expiry.sql. Es idempotente.
--
-- Por qué hacen falta:
--   1. PostgREST no permite un OR que mezcle una columna propia con una de
--      una tabla relacionada. Aplanando el join, "buscar en el motivo o en el
--      nombre del producto" pasa a ser un OR simple sobre una sola tabla.
--   2. El estado de stock compara dos columnas de la misma fila
--      (stock vs min_stock) y PostgREST solo compara contra valores literales.
--      Calculado acá, se vuelve una columna filtrable y ordenable.
--
-- security_invoker = true: la vista respeta las políticas RLS del usuario que
-- consulta, en vez de las del dueño de la vista. Requiere PostgreSQL 15+.

-- OJO: estas dos reglas están duplicadas en el código del cliente.
-- Si cambian acá, hay que cambiarlas también en:
--   - RESTOCK_TARGET_FACTOR en src/lib/features/products/domain/constants.js
--   - EXPIRY_WARNING_DAYS   en src/lib/features/expiry/domain/constants.js

create or replace view public.product_rows
with (security_invoker = true) as
select
	p.id,
	p.sku,
	p.name,
	p.description,
	p.category_id,
	coalesce(c.name, 'Sin categoría') as category,
	p.unit,
	p.stock,
	p.min_stock,
	p.price,
	p.perishable,
	p.created_at,
	p.updated_at,
	case
		when p.stock <= 0 then 'out'
		when p.stock <= p.min_stock then 'low'
		else 'ok'
	end as stock_status,
	greatest(greatest(p.min_stock * 2, p.min_stock + 1) - p.stock, 0) as missing_units,
	(p.stock * p.price) as stock_value
from public.products p
left join public.categories c on c.id = p.category_id;

create or replace view public.movement_rows
with (security_invoker = true) as
select
	m.id,
	m.product_id,
	m.batch_id,
	m.type,
	m.quantity,
	m.resulting_stock,
	m.reason,
	m.created_at,
	coalesce(p.name, 'Producto eliminado') as product_name,
	coalesce(p.sku, '') as product_sku,
	coalesce(p.unit, 'unidad') as product_unit
from public.stock_movements m
left join public.products p on p.id = m.product_id;

create or replace view public.batch_rows
with (security_invoker = true) as
select
	b.id,
	b.product_id,
	b.code,
	b.expires_at,
	b.quantity,
	b.created_at,
	coalesce(p.name, 'Producto eliminado') as product_name,
	coalesce(p.sku, '') as product_sku,
	coalesce(p.unit, 'unidad') as product_unit,
	coalesce(p.price, 0) as product_price,
	(b.expires_at - current_date) as days_left
from public.product_batches b
left join public.products p on p.id = b.product_id;

create or replace view public.category_rows
with (security_invoker = true) as
select
	c.id,
	c.name,
	c.created_at,
	count(p.id) as product_count,
	count(p.id) filter (where p.stock <= p.min_stock) as restock_count
from public.categories c
left join public.products p on p.category_id = c.id
group by c.id, c.name, c.created_at;

-- Una sola fila con los totales del panel y los contadores del sidebar, para
-- no tener que traer todos los productos solo para contar.
create or replace view public.inventory_summary
with (security_invoker = true) as
select
	(select count(*) from public.products) as product_count,
	(select coalesce(sum(stock), 0) from public.products) as total_units,
	(select coalesce(sum(stock * price), 0) from public.products) as inventory_value,
	(select count(*) from public.products where stock <= min_stock) as restock_count,
	(select count(*) from public.products where stock <= 0) as out_of_stock_count,
	(select count(*) from public.categories) as category_count,
	(
		select count(*) from public.product_batches
		where quantity > 0 and expires_at <= current_date + 30
	) as expiring_count,
	(
		select count(*) from public.product_batches
		where quantity > 0 and expires_at < current_date
	) as expired_count;

grant select on public.product_rows to anon, authenticated;
grant select on public.movement_rows to anon, authenticated;
grant select on public.batch_rows to anon, authenticated;
grant select on public.category_rows to anon, authenticated;
grant select on public.inventory_summary to anon, authenticated;
