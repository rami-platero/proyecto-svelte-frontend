<script>
	/** @import { Product } from '../types.js' */
	import ArrowDownUpIcon from '@lucide/svelte/icons/arrow-down-up';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { TableCell, TableRow } from '#lib/shared/components/ui/table/index.js';
	import { formatMoney } from '#lib/shared/utils/format.js';
	import { getStockStatus, missingUnits } from '../domain/stock.js';
	import StockBadge from './StockBadge.svelte';
	import StockBar from './StockBar.svelte';

	/**
	 * @type {{
	 *   product: Product,
	 *   onedit?: (product: Product) => void,
	 *   ondelete?: (product: Product) => void,
	 *   onmove?: (product: Product) => void
	 * }}
	 */
	let { product, onedit, ondelete, onmove } = $props();

	const status = $derived(getStockStatus(product));
	const missing = $derived(missingUnits(product));
</script>

<TableRow class={status.id !== 'ok' ? 'shadow-[inset_3px_0_0_var(--color-amber-500)]' : ''}>
	<TableCell>
		<span class="flex flex-col">
			<span class="font-medium">{product.name}</span>
			<span class="text-muted-foreground font-mono text-xs">{product.sku}</span>
		</span>
	</TableCell>
	<TableCell class="text-muted-foreground">{product.category}</TableCell>
	<TableCell>
		<StockBadge {product} />
		{#if missing > 0}
			<span class="mt-1 block text-xs font-semibold text-amber-600 dark:text-amber-400">
				Faltan {missing}
			</span>
		{/if}
	</TableCell>
	<TableCell><StockBar {product} /></TableCell>
	<TableCell class="tabular-nums whitespace-nowrap">{formatMoney(product.price)}</TableCell>
	<TableCell>
		<div class="flex justify-end gap-0.5">
			<Button variant="ghost" size="icon-sm" onclick={() => onmove?.(product)}>
				<ArrowDownUpIcon />
				<span class="sr-only">Registrar movimiento de {product.name}</span>
			</Button>
			<Button variant="ghost" size="icon-sm" onclick={() => onedit?.(product)}>
				<PencilIcon />
				<span class="sr-only">Editar {product.name}</span>
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				class="text-destructive"
				onclick={() => ondelete?.(product)}
			>
				<Trash2Icon />
				<span class="sr-only">Borrar {product.name}</span>
			</Button>
		</div>
	</TableCell>
</TableRow>
