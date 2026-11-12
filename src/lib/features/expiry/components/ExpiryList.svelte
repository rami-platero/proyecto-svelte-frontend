<script>
	/** @import { Batch } from '../types.js' */
	import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
	import InfoIcon from '@lucide/svelte/icons/info';
	import Paginator from '#lib/shared/components/data/Paginator.svelte';
	import EmptyState from '#lib/shared/components/feedback/EmptyState.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/shared/components/ui/card/index.js';
	import { EXPIRY_WARNING_DAYS } from '../domain/constants.js';
	import ExpiryListItem from './ExpiryListItem.svelte';

	/**
	 * @type {{
	 *   batches?: Batch[],
	 *   total?: number,
	 *   page?: number,
	 *   perPage?: number,
	 *   ondiscard?: (batch: Batch) => void,
	 *   onpagechange?: (page: number) => void
	 * }}
	 */
	let { batches = [], total = 0, page = 1, perPage = 8, ondiscard, onpagechange } = $props();
</script>

{#if total === 0}
	<Card>
		<EmptyState
			icon={CircleCheckIcon}
			title="Nada por vencer"
			description={'Ningún lote vence en los próximos ' + EXPIRY_WARNING_DAYS + ' días.'}
		/>
	</Card>
{:else}
	<div class="grid gap-3">
		<Card class="gap-0 py-0">
			<CardHeader class="border-b py-4">
				<CardTitle>Lotes que necesitan una decisión</CardTitle>
			</CardHeader>
			<CardContent class="px-0">
				<ul class="divide-y">
					{#each batches as batch (batch.id)}
						<ExpiryListItem {batch} {ondiscard} />
					{/each}
				</ul>

				<Paginator {page} {total} {perPage} label="lotes" onchange={onpagechange} />
			</CardContent>
		</Card>

		<p class="text-muted-foreground flex items-start gap-2 text-xs">
			<InfoIcon class="mt-0.5 size-4 shrink-0" />
			<span>
				Los porcentajes de descuento son una heurística basada en cuánto habría que acelerar la
				venta: la app no tiene datos de cuánto responde la demanda a una baja de precio. Usalos como
				punto de partida, no como un número exacto.
			</span>
		</p>
	</div>
{/if}
