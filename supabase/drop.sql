-- CUIDADO: borra las TABLAS del inventario y todo su contenido.
-- Es el paso necesario cuando la estructura cambió (por ejemplo, al pasar las
-- columnas de español a inglés): schema.sql usa "create table if not exists",
-- así que sobre una tabla vieja no hace nada y el seed falla con
-- "column ... does not exist".
--
-- Orden para reconstruir todo desde cero:
--   1) drop.sql     (este archivo)
--   2) schema.sql
--   3) expiry.sql
--   4) seed.sql

drop function if exists public.registrar_movimiento(bigint, text, integer, text);
drop function if exists public.registrar_movimiento(bigint, text, integer, text, date, text, bigint);
drop function if exists public.register_movement(bigint, text, integer, text, date, text, bigint);

drop table if exists public.stock_movements cascade;
drop table if exists public.product_batches cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;

drop function if exists public.touch_updated_at() cascade;
