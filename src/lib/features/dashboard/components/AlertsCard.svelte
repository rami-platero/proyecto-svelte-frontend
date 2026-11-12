<script>
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/shared/components/ui/card/index.js';
	import { formatUnits } from '#lib/shared/utils/format.js';
	import { batches } from '#lib/features/expiry/state/batches.svelte.js';
	import { describeDays } from '#lib/features/expiry/domain/expiry.js';
	import { products } from '#lib/features/products/state/products.svelte.js';
	import { getStockStatus, missingUnits } from '#lib/features/products/domain/stock.js';
	import { summary } from '../state/summary.svelte.js';
	import { buildAlerts } from '../domain/alerts.js';
	import AlertListItem from './AlertListItem.svelte';

	/** @type {{ limit?: number }} */
	let { limit = 5 } = $props();

	const alerts = $derived(
		buildAlerts({
			batches: batches.items.map((batch) => ({
				batch,
				expired: (batch.days_left ?? 0) < 0,
				days: batch.days_left ?? 0,
				detalle:
					formatUnits(batch.quantity, batch.unit) +
					' · ' +
					describeDays(batch.days_left ?? 0) +
					(batch.code ? ' · lote ' + batch.code : '')
			})),
			products: products.restock.map((product) => ({
				product,
				outOfStock: getStockStatus(product).id === 'out',
				detalle:
					getStockStatus(product).label.toLowerCase() +
					' · quedan ' +
					formatUnits(product.stock, product.unit) +
					' · reponer ' +
					missingUnits(product)
			}))
		})
	);

	const visible = $derived(alerts.slice(0, limit));

	/** Total real en la base, no solo lo que está cargado en pantalla. */
	const total = $derived(summary.data.restockCount + summary.data.expiringCount);
</script>

<Card class="gap-0 py-0">
	<CardHeader class="flex-row items-center justify-between gap-2 border-b py-4">
		<CardTitle>Necesita tu atención</CardTitle>
		{#if total > visible.length}
			<span class="text-muted-foreground text-xs">
				Mostrando {visible.length} de {total}
			</span>
		{/if}
	</CardHeader>

	<CardContent class="px-0">
		{#if visible.length === 0}
			<p class="text-muted-foreground flex items-center gap-2 px-6 py-5 text-sm">
				<CircleCheckIcon class="size-4 text-emerald-600 dark:text-emerald-400" />
				No hay nada urgente: ningún producto bajo mínimo ni lotes por vencer.
			</p>
		{:else}
			<ul class="divide-y">
				{#each visible as alert (alert.id)}
					<AlertListItem {alert} />
				{/each}
			</ul>
		{/if}
	</CardContent>
</Card>
