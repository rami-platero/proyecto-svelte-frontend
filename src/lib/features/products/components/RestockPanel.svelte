<script>
	/** @import { Product } from '#lib/features/products/types.js' */
	import CheckIcon from '@lucide/svelte/icons/check';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import EmptyState from '#lib/shared/components/feedback/EmptyState.svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/shared/components/ui/card/index.js';
	import { formatUnits } from '#lib/shared/utils/format.js';
	import { getStockStatus, missingUnits } from '#lib/features/products/domain/stock.js';
	import StockBadge from './StockBadge.svelte';
	import StockBar from './StockBar.svelte';

	/**
	 * @type {{
	 *   products?: Product[],
	 *   onrestock?: (product: Product, missing: number) => void,
	 *   compact?: boolean
	 * }}
	 */
	let { products = [], onrestock, compact = false } = $props();

	const outOfStock = $derived(
		products.filter((product) => getStockStatus(product).id === 'out').length
	);
</script>

<Card class="gap-0 py-0">
	<CardHeader class="flex-row items-center justify-between gap-3 border-b py-4">
		<div class="flex items-center gap-3">
			<span
				class="grid size-10 shrink-0 place-items-center rounded-lg {outOfStock > 0
					? 'bg-destructive/15 text-destructive'
					: 'bg-amber-500/15 text-amber-700 dark:text-amber-400'}"
			>
				<TriangleAlertIcon class="size-5" />
			</span>
			<div>
				<CardTitle>Hay que reponer</CardTitle>
				<p class="text-muted-foreground text-sm" aria-live="polite">
					{#if products.length === 0}
						Todos los productos están por encima del mínimo.
					{:else}
						{products.length}
						{products.length === 1 ? 'producto necesita' : 'productos necesitan'} reposición
						{#if outOfStock > 0}· {outOfStock} sin stock{/if}
					{/if}
				</p>
			</div>
		</div>
		{#if !compact && products.length > 0}
			<Button variant="outline" size="sm" href="/productos?status=restock">Ver listado completo</Button>
		{/if}
	</CardHeader>

	<CardContent class="px-0">
		{#if products.length === 0}
			<EmptyState
				icon={CheckIcon}
				title="Inventario en orden"
				description="Ningún producto bajó del stock mínimo. Cuando alguno baje, aparece acá con la cantidad sugerida a reponer."
			/>
		{:else}
			<ul class="divide-y">
				{#each products as product (product.id)}
					{@const status = getStockStatus(product)}
					{@const missing = missingUnits(product)}
					<li
						class="flex flex-wrap items-center justify-between gap-3 px-6 py-3 {status.id ===
						'out'
							? 'bg-destructive/5'
							: ''}"
					>
						<div class="grid min-w-0 flex-1 gap-1 sm:basis-64">
							<div class="flex items-center gap-2">
								<h3 class="truncate text-sm font-semibold">{product.name}</h3>
								<StockBadge {product} withIcon={false} />
							</div>
							<p class="text-muted-foreground flex flex-wrap gap-1.5 text-xs">
								<span class="font-mono">{product.sku}</span>
								<span aria-hidden="true">·</span>
								<span>Quedan {formatUnits(product.stock, product.unit)}</span>
								<span aria-hidden="true">·</span>
								<span>mínimo {product.min_stock}</span>
							</p>
							<StockBar {product} showLegend={false} />
						</div>

						<div class="flex items-center gap-3">
							<p class="flex flex-col items-end leading-tight tabular-nums">
								<strong class="text-lg text-amber-600 dark:text-amber-400">{missing}</strong>
								<span class="text-muted-foreground text-xs">a reponer</span>
							</p>
							<Button size="sm" onclick={() => onrestock?.(product, missing)}>
								<TrendingUpIcon />
								Reponer
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</CardContent>
</Card>
