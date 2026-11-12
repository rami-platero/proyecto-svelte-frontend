<script>
	import ArrowDownUpIcon from '@lucide/svelte/icons/arrow-down-up';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Card, CardContent } from '#lib/shared/components/ui/card/index.js';
	import { formatMoney, formatUnits } from '#lib/shared/utils/format.js';
	import { getStockStatus, missingUnits } from '#lib/features/products/domain/stock.js';
	import StockBadge from './StockBadge.svelte';
	import StockBar from './StockBar.svelte';

	/**
	 * @type {{
	 *   product: import('#lib/features/products/types.js').Product,
	 *   onedit?: (product: import('#lib/features/products/types.js').Product) => void,
	 *   ondelete?: (product: import('#lib/features/products/types.js').Product) => void,
	 *   onmove?: (product: import('#lib/features/products/types.js').Product) => void
	 * }}
	 */
	let { product, onedit, ondelete, onmove } = $props();

	const status = $derived(getStockStatus(product));
	const missing = $derived(missingUnits(product));
</script>

<Card class={status.id !== 'ok' ? 'border-amber-500/50' : ''}>
	<CardContent class="grid gap-3">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0">
				<h3 class="text-base leading-tight font-semibold">{product.name}</h3>
				<p class="text-muted-foreground mt-0.5 flex flex-wrap gap-1.5 text-xs">
					<span class="font-mono">{product.sku}</span>
					<span aria-hidden="true">·</span>
					<span>{product.category}</span>
				</p>
			</div>
			<StockBadge {product} />
		</div>

		<StockBar {product} />

		<dl class="grid grid-cols-3 gap-2 text-sm">
			<div class="min-w-0">
				<dt class="text-muted-foreground text-xs">Stock</dt>
				<dd class="truncate font-semibold tabular-nums">{formatUnits(product.stock, product.unit)}</dd>
			</div>
			<div class="min-w-0">
				<dt class="text-muted-foreground text-xs">Mínimo</dt>
				<dd class="truncate font-semibold tabular-nums">{product.min_stock}</dd>
			</div>
			<div class="min-w-0">
				<dt class="text-muted-foreground text-xs">Precio</dt>
				<dd class="truncate font-semibold tabular-nums">{formatMoney(product.price)}</dd>
			</div>
		</dl>

		{#if status.id !== 'ok'}
			<p class="rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
				{status.message}
				{#if missing > 0}
					<strong>Reponer {missing}.</strong>
				{/if}
			</p>
		{/if}

		<div class="flex flex-wrap gap-2">
			<Button size="sm" onclick={() => onmove?.(product)}>
				<ArrowDownUpIcon />
				Movimiento
			</Button>
			<Button size="sm" variant="outline" onclick={() => onedit?.(product)}>
				<PencilIcon />
				Editar
			</Button>
			<Button size="sm" variant="ghost" class="text-destructive" onclick={() => ondelete?.(product)}>
				<Trash2Icon />
				Borrar
			</Button>
		</div>
	</CardContent>
</Card>
