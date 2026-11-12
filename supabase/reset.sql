-- CUIDADO: borra TODOS los datos del inventario (no las tablas).
-- Sirve para limpiar los datos anteriores antes de volver a correr seed.sql.
-- Ejecutar en el SQL Editor de Supabase solo si querés empezar de cero.

truncate table public.stock_movements restart identity;
truncate table public.product_batches restart identity cascade;
truncate table public.products restart identity cascade;
truncate table public.categories restart identity cascade;
