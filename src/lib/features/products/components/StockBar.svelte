<script>
	import { Progress } from '#lib/shared/components/ui/progress/index.js';
	import { formatUnits } from '#lib/shared/utils/format.js';
	import { getStockStatus, restockTarget, stockRatio } from '#lib/features/products/domain/stock.js';

	/** @type {{ product: import('#lib/features/products/types.js').Product, showLegend?: boolean }} */
	let { product, showLegend = true } = $props();

	const status = $derived(getStockStatus(product));
	const target = $derived(restockTarget(product));
	const percent = $derived(Math.round(stockRatio(product) * 100));

	/** @type {Record<string, string>} */
	const indicator = {
		out: '[&_[data-slot=progress-indicator]]:bg-destructive',
		low: '[&_[data-slot=progress-indicator]]:bg-amber-500',
		ok: '[&_[data-slot=progress-indicator]]:bg-emerald-500'
	};
</script>

<div class="flex min-w-28 items-center gap-2">
	<Progress
		value={percent}
		max={100}
		class="h-2 {indicator[status.id] ?? indicator.ok}"
		aria-label={'Nivel de stock de ' + product.name}
		aria-valuetext={formatUnits(product.stock, product.unit) +
			' de un objetivo de ' +
			target +
			'. ' +
			status.label}
	/>
	{#if showLegend}
		<p class="flex shrink-0 flex-col text-xs leading-tight tabular-nums">
			<strong class="text-sm">{product.stock}</strong>
			<span class="text-muted-foreground">mín. {product.min_stock}</span>
		</p>
	{/if}
</div>
