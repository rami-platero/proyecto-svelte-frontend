<script>
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import { AlertsCard, DashboardSkeleton, StatsGrid } from '#lib/features/dashboard/index.js';
	import {
		MovementFormDialog,
		MovementList,
		loadRecentMovements,
		movements
	} from '#lib/features/movements/index.js';
	import { RestockPanel, loadRestockList, products } from '#lib/features/products/index.js';
	import { loadExpiringBatches } from '#lib/features/expiry/index.js';
	import ErrorAlert from '#lib/shared/components/feedback/ErrorAlert.svelte';
	import SupabaseSetupNotice from '#lib/shared/components/feedback/SupabaseSetupNotice.svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/shared/components/ui/card/index.js';
	import { APP_NAME } from '#lib/shared/config/app.js';
	import { dismissError, status } from '#lib/shared/state/status.svelte.js';
	import {
		configured,
		onDataChange,
		refreshAll
	} from '#lib/layout/state/bootstrap.svelte.js';

	/** @type {import('#lib/features/movements/types.js').MovementInput | null} */
	let movement = $state(null);

	const alerts = $derived(products.restock);
	const latest = $derived(movements.recent.slice(0, 6));

	async function loadDashboard() {
		await Promise.all([
			loadRestockList({ silent: true }),
			loadRecentMovements({ silent: true }),
			loadExpiringBatches({}, { silent: true })
		]);
	}

	$effect(() => {
		if (!configured) return;
		void loadDashboard();
		return onDataChange(loadDashboard);
	});

	/**
	 * @param {import('#lib/features/products/types.js').Product} product
	 * @param {number} missing
	 */
	function openRestock(product, missing) {
		movement = {
			product_id: product.id,
			type: 'inbound',
			quantity: missing > 0 ? missing : 1,
			reason: 'Reposición de stock'
		};
	}
</script>

<svelte:head>
	<title>Panel · {APP_NAME}</title>
</svelte:head>

<div class="grid gap-6">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Panel de inventario</h1>
			<p class="text-muted-foreground mt-1 max-w-[60ch] text-sm">
				Estado general del inventario y productos que necesitan reposición antes de quedarse sin
				stock.
			</p>
		</div>
		<Button variant="outline" onclick={() => refreshAll()} disabled={status.loading}>
			<RefreshCwIcon class={status.loading ? 'animate-spin' : ''} />
			Actualizar
		</Button>
	</div>

	{#if !configured}
		<SupabaseSetupNotice />
	{:else}
		{#if status.error}
			<ErrorAlert error={status.error} onretry={refreshAll} ondismiss={dismissError} />
		{/if}

		{#if status.loading && !status.loaded}
			<DashboardSkeleton />
		{:else}
			<StatsGrid />
			<AlertsCard />

			<div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
				<RestockPanel products={alerts} onrestock={openRestock} />

				<Card class="gap-0 py-0">
					<CardHeader class="flex-row items-center justify-between gap-2 border-b py-4">
						<CardTitle>Últimos movimientos</CardTitle>
						<Button variant="outline" size="sm" href="/movimientos">Ver historial</Button>
					</CardHeader>
					<CardContent class="px-0">
						<MovementList
							movements={latest}
							emptyMessage="Cuando registres entradas o salidas, el historial aparece acá."
						/>
					</CardContent>
				</Card>
			</div>
		{/if}
	{/if}
</div>

<MovementFormDialog preset={movement} onclose={() => (movement = null)} />
