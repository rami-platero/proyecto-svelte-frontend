<script>
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Badge } from '#lib/shared/components/ui/badge/index.js';
	import { getStockStatus } from '#lib/features/products/domain/stock.js';

	/** @type {{ product: import('#lib/features/products/types.js').Product, withIcon?: boolean }} */
	let { product, withIcon = true } = $props();

	const status = $derived(getStockStatus(product));

	/** @type {Record<string, { variant: 'destructive' | 'outline', class: string }>} */
	const styles = {
		out: { variant: 'destructive', class: '' },
		low: {
			variant: 'outline',
			class: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
		},
		ok: {
			variant: 'outline',
			class: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
		}
	};
</script>

<Badge variant={styles[status.id].variant} class={styles[status.id].class}>
	{#if withIcon && status.id !== 'ok'}
		<TriangleAlertIcon />
	{/if}
	{status.label}
</Badge>
