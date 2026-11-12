<script>
	import {
		MovementFilters,
		MovementForm,
		MovementList,
		MovementListSkeleton,
		applyMovement,
		loadMovements,
		movements
	} from '#lib/features/movements/index.js';
	import { products } from '#lib/features/products/index.js';
	import ErrorAlert from '#lib/shared/components/feedback/ErrorAlert.svelte';
	import SupabaseSetupNotice from '#lib/shared/components/feedback/SupabaseSetupNotice.svelte';
	import { Badge } from '#lib/shared/components/ui/badge/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '#lib/shared/components/ui/card/index.js';
	import { APP_NAME } from '#lib/shared/config/app.js';
	import { syncStateWithQuery } from '#lib/shared/hooks/query-sync.svelte.js';
	import { dismissError, status } from '#lib/shared/state/status.svelte.js';
	import { debounce } from '#lib/shared/utils/debounce.js';
	import { configured, onDataChange, refreshAll } from '#lib/layout/state/bootstrap.svelte.js';

	const PER_PAGE = 12;
	const DEFAULT_MOVEMENT_FILTERS = { query: '', type: 'all', page: '1' };

	const movementFilters = $state({ ...DEFAULT_MOVEMENT_FILTERS });
	let lastSaved = $state(0);

	syncStateWithQuery(movementFilters, DEFAULT_MOVEMENT_FILTERS);

	const query = $derived({
		page: Number(movementFilters.page) || 1,
		perPage: PER_PAGE,
		search: movementFilters.query,
		type: movementFilters.type
	});

	const runQuery = debounce(
		(/** @type {import('#lib/features/movements/types.js').MovementQuery} */ next) => {
			void loadMovements(next, { silent: true });
		}
	);

	// El historial completo vive en la base: cada filtro o cambio de página
	// pide solo esa porción, en vez de traer todo y filtrar acá.
	$effect(() => {
		runQuery(query);
	});

	$effect(() => onDataChange(() => loadMovements(query, { silent: true })));

	/** @param {number} value */
	function goToPage(value) {
		movementFilters.page = String(value);
	}

	/** @param {import('#lib/features/movements/types.js').MovementInput} values */
	async function save(values) {
		const saved = await applyMovement(values);
		if (saved) {
			lastSaved = Date.now();
			await refreshAll();
		}
	}
</script>

<svelte:head>
	<title>Movimientos · {APP_NAME}</title>
</svelte:head>

<div class="grid gap-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Movimientos de stock</h1>
		<p class="text-muted-foreground mt-1 max-w-[70ch] text-sm">
			Toda entrada, salida o ajuste queda registrada con el stock resultante, así se puede auditar
			cómo llegó cada producto a su cantidad actual.
		</p>
	</div>

	{#if !configured}
		<SupabaseSetupNotice />
	{:else}
		{#if status.error}
			<ErrorAlert error={status.error} onretry={refreshAll} ondismiss={dismissError} />
		{/if}

		<div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
			<Card>
				<CardHeader>
					<CardTitle>Registrar movimiento</CardTitle>
					<CardDescription>
						El stock se actualiza en una sola operación del lado de la base de datos.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{#if products.options.length === 0}
						<p class="text-muted-foreground text-sm">
							Cargá productos antes de registrar movimientos.
						</p>
					{:else}
						{#key lastSaved}
							<MovementForm products={products.options} busy={status.busy} onsave={save} />
						{/key}
					{/if}
				</CardContent>
			</Card>

			<Card class="gap-0 py-0">
				<CardHeader class="grid gap-3 border-b py-4">
					<div class="flex items-center gap-2">
						<CardTitle>Historial</CardTitle>
						<Badge variant="secondary">{movements.total}</Badge>
					</div>
					<MovementFilters bind:query={movementFilters.query} bind:type={movementFilters.type} />
				</CardHeader>

				<CardContent class="px-0">
					{#if status.loading && movements.items.length === 0}
						<MovementListSkeleton />
					{:else}
						<MovementList
							movements={movements.items}
							total={movements.total}
							page={Number(movementFilters.page) || 1}
							perPage={PER_PAGE}
							onpagechange={goToPage}
							emptyMessage={movementFilters.query || movementFilters.type !== 'all'
								? 'Ningún movimiento coincide con los filtros aplicados.'
								: 'Cuando registres el primer movimiento, aparece acá.'}
						/>
					{/if}
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
