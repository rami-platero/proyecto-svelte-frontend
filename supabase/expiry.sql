-- Extensión del inventario: lotes y vencimientos.
-- Ejecutar DESPUÉS de schema.sql. Es idempotente: se puede correr varias veces.
--
-- El vencimiento pertenece al lote, no al producto: un mismo producto puede tener
-- varias tandas compradas en fechas distintas, cada una con su vencimiento.
-- Para los productos marcados como perecederos, products.stock pasa a ser
-- siempre la suma de las cantidades de sus lotes.

alter table public.products
	add column if not exists perishable boolean not null default false;

create table if not exists public.product_batches (
	id bigint generated always as identity primary key,
	product_id bigint not null references public.products (id) on delete cascade,
	code text,
	expires_at date not null,
	quantity integer not null default 0 check (quantity >= 0),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists product_batches_product_id_idx on public.product_batches (product_id);
create index if not exists product_batches_expires_at_idx on public.product_batches (expires_at);
create unique index if not exists product_batches_unique
	on public.product_batches (product_id, expires_at, coalesce(code, ''));

drop trigger if exists product_batches_touch_updated_at on public.product_batches;
create trigger product_batches_touch_updated_at
	before update on public.product_batches
	for each row
	execute function public.touch_updated_at();

alter table public.stock_movements
	add column if not exists batch_id bigint references public.product_batches (id) on delete set null;

alter table public.product_batches enable row level security;
alter table public.product_batches replica identity full;

drop policy if exists "batches public select" on public.product_batches;
create policy "batches public select" on public.product_batches for select using (true);
drop policy if exists "batches public insert" on public.product_batches;
create policy "batches public insert" on public.product_batches for insert with check (true);
drop policy if exists "batches public update" on public.product_batches;
create policy "batches public update" on public.product_batches for update using (true);
drop policy if exists "batches public delete" on public.product_batches;
create policy "batches public delete" on public.product_batches for delete using (true);

do $$
begin
	if not exists (
		select 1 from pg_publication_tables
		where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'product_batches'
	) then
		alter publication supabase_realtime add table public.product_batches;
	end if;
end
$$;

drop function if exists public.registrar_movimiento(bigint, text, integer, text);
drop function if exists public.registrar_movimiento(bigint, text, integer, text, date, text, bigint);

create or replace function public.register_movement(
	p_product_id bigint,
	p_type text,
	p_quantity integer,
	p_reason text default null,
	p_expires_at date default null,
	p_batch_code text default null,
	p_batch_id bigint default null
)
returns public.products
language plpgsql
security invoker
set search_path = public
as $$
declare
	v_product public.products;
	v_final_stock integer;
	v_remaining integer;
	v_taken integer;
	v_batch record;
	v_batch_id bigint;
begin
	select * into v_product from public.products where id = p_product_id for update;

	if not found then
		raise exception 'El producto % no existe.', p_product_id using errcode = 'P0002';
	end if;

	if p_type not in ('inbound', 'outbound', 'adjustment') then
		raise exception 'Tipo de movimiento invalido: %.', p_type using errcode = '22023';
	end if;

	if p_type <> 'adjustment' and p_quantity <= 0 then
		raise exception 'La cantidad debe ser mayor que cero.' using errcode = '22023';
	end if;

	if v_product.perishable then
		if p_type = 'inbound' then
			if p_expires_at is null then
				raise exception 'Es un producto perecedero: indicá la fecha de vencimiento del lote.'
					using errcode = '22023';
			end if;

			insert into public.product_batches (product_id, code, expires_at, quantity)
			values (p_product_id, nullif(btrim(p_batch_code), ''), p_expires_at, p_quantity)
			on conflict (product_id, expires_at, coalesce(code, ''))
			do update set quantity = public.product_batches.quantity + excluded.quantity
			returning id into v_batch_id;

		elsif p_type = 'outbound' then
			v_remaining := p_quantity;

			if p_batch_id is not null then
				select * into v_batch
					from public.product_batches
					where id = p_batch_id and product_id = p_product_id
					for update;

				if not found then
					raise exception 'El lote indicado no existe para este producto.' using errcode = 'P0002';
				end if;

				if v_batch.quantity < v_remaining then
					raise exception 'El lote tiene % unidades y se intentan retirar %.',
						v_batch.quantity, v_remaining using errcode = '23514';
				end if;

				update public.product_batches set quantity = quantity - v_remaining where id = v_batch.id;
				v_batch_id := v_batch.id;
			else
				for v_batch in
					select * from public.product_batches
					where product_id = p_product_id and quantity > 0
					order by expires_at asc, id asc
					for update
				loop
					exit when v_remaining <= 0;
					v_taken := least(v_batch.quantity, v_remaining);
					update public.product_batches set quantity = quantity - v_taken where id = v_batch.id;
					v_remaining := v_remaining - v_taken;
					if v_batch_id is null then
						v_batch_id := v_batch.id;
					end if;
				end loop;

				if v_remaining > 0 then
					raise exception 'Stock insuficiente en los lotes: faltan % unidades.', v_remaining
						using errcode = '23514';
				end if;
			end if;

		else
			if p_batch_id is null then
				raise exception 'En un producto perecedero el ajuste se hace sobre un lote.'
					using errcode = '22023';
			end if;

			update public.product_batches
				set quantity = p_quantity
				where id = p_batch_id and product_id = p_product_id
				returning id into v_batch_id;

			if v_batch_id is null then
				raise exception 'El lote indicado no existe para este producto.' using errcode = 'P0002';
			end if;
		end if;

		select coalesce(sum(quantity), 0) into v_final_stock
			from public.product_batches where product_id = p_product_id;
	else
		if p_type = 'inbound' then
			v_final_stock := v_product.stock + p_quantity;
		elsif p_type = 'outbound' then
			v_final_stock := v_product.stock - p_quantity;
		else
			v_final_stock := p_quantity;
		end if;

		if v_final_stock < 0 then
			raise exception 'Stock insuficiente: hay % unidades disponibles.', v_product.stock
				using errcode = '23514';
		end if;
	end if;

	update public.products
		set stock = v_final_stock
		where id = p_product_id
		returning * into v_product;

	insert into public.stock_movements (product_id, batch_id, type, quantity, resulting_stock, reason)
	values (p_product_id, v_batch_id, p_type, p_quantity, v_final_stock, nullif(btrim(p_reason), ''));

	return v_product;
end;
$$;

grant execute on function public.register_movement(bigint, text, integer, text, date, text, bigint)
	to anon, authenticated;
