-- Datos de ejemplo: un almacén de barrio, con productos perecederos y no perecederos.
-- Si ya habías cargado otros datos, corré antes reset.sql para vaciar las tablas.
-- Ejecutar después de schema.sql y expiry.sql. Es idempotente.
-- Las fechas son relativas a hoy, así la demo siempre muestra los tres estados.

insert into public.categories (name)
values ('Lácteos'), ('Panificados'), ('Fiambres'), ('Almacén'), ('Limpieza')
on conflict (name) do nothing;

insert into public.products (sku, name, description, category_id, unit, stock, min_stock, price, perishable)
values
	('LEC-ENT-1L', 'Leche entera 1L', 'Sachet, cadena de frío.', (select id from public.categories where name = 'Lácteos'), 'unidad', 0, 24, 1450, true),
	('YOG-FRU-190', 'Yogur bebible frutilla 190g', 'Pack por 6 unidades.', (select id from public.categories where name = 'Lácteos'), 'pack', 0, 10, 3200, true),
	('QUE-CRE-500', 'Queso crema 500g', 'Pote, refrigerado.', (select id from public.categories where name = 'Lácteos'), 'unidad', 0, 8, 4100, true),
	('PAN-LAC-500', 'Pan lactal 500g', 'Bolsa, estante seco.', (select id from public.categories where name = 'Panificados'), 'unidad', 0, 12, 2600, true),
	('FAC-DOC', 'Facturas por docena', 'Elaboración propia.', (select id from public.categories where name = 'Panificados'), 'caja', 0, 6, 7800, true),
	('JAM-COC-KG', 'Jamón cocido', 'Al corte, refrigerado.', (select id from public.categories where name = 'Fiambres'), 'kg', 0, 3, 12900, true),
	('SAL-MIL-KG', 'Salame milán', 'Al corte, estacionado.', (select id from public.categories where name = 'Fiambres'), 'kg', 0, 2, 15400, true),
	('FID-500', 'Fideos guiseros 500g', 'Paquete, estante seco.', (select id from public.categories where name = 'Almacén'), 'unidad', 48, 20, 1900, false),
	('ARR-1KG', 'Arroz largo fino 1kg', 'Paquete, estante seco.', (select id from public.categories where name = 'Almacén'), 'unidad', 7, 15, 2400, false),
	('ACE-GIR-900', 'Aceite de girasol 900ml', 'Botella.', (select id from public.categories where name = 'Almacén'), 'unidad', 22, 12, 3300, false),
	('YER-1KG', 'Yerba mate 1kg', 'Paquete.', (select id from public.categories where name = 'Almacén'), 'unidad', 0, 8, 6700, false),
	('LAV-2L', 'Lavandina 2L', 'Bidón.', (select id from public.categories where name = 'Limpieza'), 'unidad', 31, 10, 2100, false),
	('DET-750', 'Detergente 750ml', 'Botella.', (select id from public.categories where name = 'Limpieza'), 'unidad', 5, 9, 2850, false)
on conflict (sku) do nothing;

-- Lotes: uno vencido, varios por vencer y algunos en fecha.
insert into public.product_batches (product_id, code, expires_at, quantity)
select p.id, v.code, current_date + v.days, v.quantity
from public.products p
join (
	values
		('LEC-ENT-1L', 'L-A', -2, 9),
		('LEC-ENT-1L', 'L-B', 4, 18),
		('LEC-ENT-1L', 'L-C', 12, 24),
		('YOG-FRU-190', 'Y-A', 3, 14),
		('YOG-FRU-190', 'Y-B', 21, 10),
		('QUE-CRE-500', 'Q-A', -5, 4),
		('QUE-CRE-500', 'Q-B', 18, 11),
		('PAN-LAC-500', 'P-A', 2, 22),
		('PAN-LAC-500', 'P-B', 9, 15),
		('FAC-DOC', 'F-A', 1, 5),
		('JAM-COC-KG', 'J-A', 6, 7),
		('JAM-COC-KG', 'J-B', 40, 9),
		('SAL-MIL-KG', 'S-A', 75, 6)
) as v (sku, code, days, quantity) on v.sku = p.sku
on conflict (product_id, expires_at, coalesce(code, '')) do nothing;

update public.products p
set stock = coalesce((select sum(b.quantity) from public.product_batches b where b.product_id = p.id), 0)
where p.perishable;

-- Carga inicial de los productos que no manejan lotes.
insert into public.stock_movements (product_id, type, quantity, resulting_stock, reason, created_at)
select p.id, 'inbound', p.stock, p.stock, 'Carga inicial de inventario', now() - interval '20 days'
from public.products p
where p.perishable = false
	and p.stock > 0
	and not exists (select 1 from public.stock_movements m where m.product_id = p.id);

-- Historial de ventas: le da a la app datos reales para estimar el ritmo de venta.
-- Sin esto, las sugerencias dirían "sin datos suficientes" (que es lo correcto).
insert into public.stock_movements (product_id, type, quantity, resulting_stock, reason, created_at)
select
	p.id,
	'outbound',
	v.quantity,
	p.stock,
	'Venta en mostrador',
	now() - (v.days_ago || ' days')::interval
from public.products p
join (
	values
		('LEC-ENT-1L', 6, 1), ('LEC-ENT-1L', 5, 3), ('LEC-ENT-1L', 7, 5), ('LEC-ENT-1L', 4, 8),
		('LEC-ENT-1L', 6, 11), ('LEC-ENT-1L', 5, 14), ('LEC-ENT-1L', 8, 17), ('LEC-ENT-1L', 4, 21),
		('YOG-FRU-190', 2, 2), ('YOG-FRU-190', 1, 6), ('YOG-FRU-190', 2, 10), ('YOG-FRU-190', 1, 15),
		('QUE-CRE-500', 1, 3), ('QUE-CRE-500', 1, 12),
		('PAN-LAC-500', 4, 1), ('PAN-LAC-500', 6, 3), ('PAN-LAC-500', 5, 5), ('PAN-LAC-500', 7, 8),
		('PAN-LAC-500', 4, 12), ('PAN-LAC-500', 5, 16), ('PAN-LAC-500', 6, 20),
		('JAM-COC-KG', 1, 4), ('JAM-COC-KG', 2, 9), ('JAM-COC-KG', 1, 16)
) as v (sku, quantity, days_ago) on v.sku = p.sku
where not exists (
	select 1 from public.stock_movements m
	where m.product_id = p.id and m.reason = 'Venta en mostrador'
);
