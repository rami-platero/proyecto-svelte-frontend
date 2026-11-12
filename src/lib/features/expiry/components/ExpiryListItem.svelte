<script>
	/** @import { Batch } from '../types.js' */
	import PackageXIcon from '@lucide/svelte/icons/package-x';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { formatDate, formatUnits } from '#lib/shared/utils/format.js';
	import { productById } from '#lib/features/products/state/products.svelte.js';
	import { movements } from '#lib/features/movements/state/movements.svelte.js';
	import { getExpiryStatus } from '../domain/expiry.js';
	import ExpiryBadge from './ExpiryBadge.svelte';
	import PromoAdviceCard from './PromoAdviceCard.svelte';

	/** @type {{ batch: Batch, ondiscard?: (batch: Batch) => void }} */
	let { batch, ondiscard } = $props();

	const status = $derived(getExpiryStatus(batch));
	const product = $derived(productById(batch.product_id));
</script>

<li class="grid gap-3 px-6 py-4 {status.id === 'expired' ? 'bg-destructive/5' : ''}">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="min-w-0">
			<div class="flex flex-wrap items-center gap-2">
				<h3 class="font-semibold">{batch.product}</h3>
				<ExpiryBadge {batch} />
			</div>
			<p class="text-muted-foreground mt-0.5 flex flex-wrap gap-1.5 text-xs">
				<span class="font-mono">{batch.sku}</span>
				<span aria-hidden="true">·</span>
				<span>
					{#if batch.code}Lote {batch.code} ·{/if}
					vence el {formatDate(batch.expires_at)}
				</span>
				<span aria-hidden="true">·</span>
				<span>{formatUnits(batch.quantity, batch.unit)}</span>
			</p>
		</div>

		{#if status.id === 'expired'}
			<Button variant="outline" size="sm" class="text-destructive" onclick={() => ondiscard?.(batch)}>
				<PackageXIcon />
				Dar de baja
			</Button>
		{/if}
	</div>

	<PromoAdviceCard {batch} {product} movements={movements.items} />
</li>
