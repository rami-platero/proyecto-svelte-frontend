<script>
	/** @import { Batch } from '#lib/features/expiry/types.js' */
	/** @import { Product } from '#lib/features/products/types.js' */
	import InfoIcon from '@lucide/svelte/icons/info';
	import { Badge } from '#lib/shared/components/ui/badge/index.js';
	import { CONFIDENCE_LABELS } from '#lib/features/movements/domain/constants.js';
	import { formatMoney } from '#lib/shared/utils/format.js';
	import { promoAdvice } from '#lib/features/expiry/domain/promo.js';
	import { salesSignal } from '#lib/features/movements/domain/sales.js';

	/**
	 * @type {{
	 *   batch: Batch,
	 *   product: Product | null,
	 *   movements?: import('#lib/features/movements/types.js').Movement[]
	 * }}
	 */
	let { batch, product, movements = [] } = $props();

	const signal = $derived(salesSignal(movements, batch.product_id));
	const advice = $derived(product ? promoAdvice(batch, product, signal) : null);

	/** @type {Record<string, { variant: 'destructive' | 'outline' | 'secondary', class: string }>} */
	const tones = {
		expired: { variant: 'destructive', class: '' },
		clear: { variant: 'destructive', class: '' },
		promote: {
			variant: 'outline',
			class: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
		},
		watch: { variant: 'secondary', class: '' },
		'no-data': { variant: 'secondary', class: '' },
		none: {
			variant: 'outline',
			class: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
		}
	};

	const tone = $derived(tones[advice?.level ?? 'none'] ?? tones.none);

	const discountedPrice = $derived(
		advice?.discount && product ? product.price * (1 - advice.discount / 100) : null
	);
</script>

{#if advice}
	<div class="bg-muted/40 grid gap-2 rounded-lg border p-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant={tone.variant} class={tone.class}>
				{advice.headline}
			</Badge>

			{#if advice.discount}
				<span class="text-sm">
					Sugerencia: <strong>−{advice.discount}%</strong>
					{#if discountedPrice !== null && product}
						<span class="text-muted-foreground">
							· {formatMoney(discountedPrice)} en vez de {formatMoney(product.price)}
						</span>
					{/if}
				</span>
			{/if}

			{#if advice.valueAtRisk !== null && advice.valueAtRisk > 0}
				<span class="text-muted-foreground text-sm">
					En riesgo: <strong class="text-foreground">{formatMoney(advice.valueAtRisk)}</strong>
				</span>
			{/if}
		</div>

		<p class="text-sm">{advice.detail}</p>

		<p class="text-muted-foreground flex items-start gap-1.5 text-xs">
			<InfoIcon class="mt-0.5 size-3.5 shrink-0" />
			<span>
				{advice.basis}
				{#if signal.perDay !== null}
					· Ritmo observado: {signal.perDay.toFixed(2)} por día ({CONFIDENCE_LABELS[
						signal.confidence
					]}).
				{/if}
			</span>
		</p>
	</div>
{/if}
