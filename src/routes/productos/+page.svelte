<script>
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import { categories } from '#lib/features/categories/index.js';
	import {
		DEFAULT_FILTERS,
		DeleteProductDialog,
		ProductFilters,
		ProductFormDialog,
		ProductList,
		ProductListSkeleton,
		filters,
		loadProducts,
		products,
		resetFilters
	} from '#lib/features/products/index.js';
	import { MovementFormDialog } from '#lib/features/movements/index.js';
	import EmptyState from '#lib/shared/components/feedback/EmptyState.svelte';
	import ErrorAlert from '#lib/shared/components/feedback/ErrorAlert.svelte';
	import SupabaseSetupNotice from '#lib/shared/components/feedback/SupabaseSetupNotice.svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Card } from '#lib/shared/components/ui/card/index.js';
	import { APP_NAME } from '#lib/shared/config/app.js';
	import { syncStateWithQuery } from '#lib/shared/hooks/query-sync.svelte.js';
	import { dismissError, status } from '#lib/shared/state/status.svelte.js';
	import { debounce } from '#lib/shared/utils/debounce.js';
	import { configured, onDataChange, refreshAll } from '#lib/layout/state/bootstrap.svelte.js';

	const PER_PAGE = 10;

	/** @type {import('#lib/features/products/types.js').Product | null} */
	let editing = $state(null);
	let creating = $state(false);
	/** @type {import('#lib/features/products/types.js').Product | null} */
	let deleting = $state(null);
	/** @type {import('#lib/features/movements/types.js').MovementInput | null} */
	let movement = $state(null);

	syncStateWithQuery(filters, DEFAULT_FILTERS);

	/** La consulta que se le manda a la base, derivada de los filtros. */
	const query = $derived({
		page: Number(filters.page) || 1,
		perPage: PER_PAGE,
		search: filters.query,
		category: filters.category,
		status: filters.status,
		sort: filters.sort,
		direction: filters.direction
	});

	const runQuery = debounce(
		(/** @type {import('#lib/features/products/types.js').ProductQuery} */ next) => {
			void loadProducts(next, { silent: true });
		}
	);

	// Cada cambio de filtro, orden o página dispara una consulta nueva: filtrar
	// y paginar lo resuelve la base, no el navegador.
	$effect(() => {
		runQuery(query);
	});

	$effect(() => onDataChange(() => loadProducts(query, { silent: true })));

	const hasFilters = $derived(
		filters.query.trim() !== '' || filters.category !== 'all' || filters.status !== 'all'
	);

	function openCreate() {
		editing = null;
		creating = true;
	}

	/** @param {import('#lib/features/products/types.js').Product} product */
	function openEdit(product) {
		creating = false;
		editing = product;
	}

	/** @param {import('#lib/features/products/types.js').Product} product */
	function openMovement(product) {
		movement = {
			product_id: product.id,
			type: 'inbound',
			quantity: product.missing_units || 1,
			reason: ''
		};
	}

	function closeProductDialog() {
		creating = false;
		editing = null;
	}

	async function afterChange() {
		await refreshAll();
	}
</script>

<svelte:head>
	<title>Productos · {APP_NAME}</title>
</svelte:head>

<div class="grid gap-6">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Productos</h1>
			<p class="text-muted-foreground mt-1 max-w-[60ch] text-sm">
				Alta, baja y modificación del inventario, con el nivel de stock de cada artículo.
			</p>
		</div>
		<Button onclick={openCreate}>
			<PlusIcon />
			Nuevo producto
		</Button>
	</div>

	{#if !configured}
		<SupabaseSetupNotice />
	{:else}
		{#if status.error}
			<ErrorAlert error={status.error} onretry={afterChange} ondismiss={dismissError} />
		{/if}

		<ProductFilters categories={categories.items} shown={products.items.length} total={products.total} />

		{#if status.loading && products.items.length === 0}
			<ProductListSkeleton />
		{:else if products.total === 0}
			<Card>
				{#if hasFilters}
					<EmptyState
						icon={SearchIcon}
						title="Ningún producto coincide"
						description="Probá con otro texto de búsqueda o quitá los filtros aplicados."
					>
						<Button variant="outline" onclick={resetFilters}>
							<XIcon />
							Limpiar filtros
						</Button>
					</EmptyState>
				{:else}
					<EmptyState
						title="Todavía no hay productos"
						description="Cargá el primer producto del inventario o ejecutá supabase/seed.sql para tener datos de ejemplo."
					>
						<Button onclick={openCreate}>
							<PlusIcon />
							Nuevo producto
						</Button>
					</EmptyState>
				{/if}
			</Card>
		{:else}
			<ProductList
				products={products.items}
				total={products.total}
				perPage={PER_PAGE}
				onedit={openEdit}
				ondelete={(product) => (deleting = product)}
				onmove={openMovement}
			/>
		{/if}
	{/if}
</div>

<ProductFormDialog
	open={creating || Boolean(editing)}
	product={editing}
	onclose={closeProductDialog}
	onsaved={afterChange}
/>
<MovementFormDialog preset={movement} onclose={() => (movement = null)} onsaved={afterChange} />
<DeleteProductDialog
	product={deleting}
	onclose={() => (deleting = null)}
	ondeleted={afterChange}
/>
