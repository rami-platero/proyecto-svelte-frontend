<script>
	/** @import { Movement } from '../types.js' */
	import ListIcon from '@lucide/svelte/icons/list';
	import Paginator from '#lib/shared/components/data/Paginator.svelte';
	import EmptyState from '#lib/shared/components/feedback/EmptyState.svelte';
	import MovementListItem from './MovementListItem.svelte';

	/**
	 * `movements` es solo la página actual; `total` es cuántos movimientos
	 * matchean el filtro en la base.
	 *
	 * @type {{
	 *   movements?: Movement[],
	 *   total?: number,
	 *   page?: number,
	 *   perPage?: number,
	 *   emptyMessage?: string,
	 *   onpagechange?: (page: number) => void
	 * }}
	 */
	let {
		movements = [],
		total = 0,
		page = 1,
		perPage = 12,
		emptyMessage = 'Todavía no hay movimientos registrados.',
		onpagechange
	} = $props();
</script>

{#if movements.length === 0}
	<EmptyState icon={ListIcon} title="Sin movimientos" description={emptyMessage} />
{:else}
	<ul class="divide-y">
		{#each movements as movement (movement.id)}
			<MovementListItem {movement} />
		{/each}
	</ul>

	{#if onpagechange}
		<Paginator {page} {total} {perPage} label="movimientos" onchange={onpagechange} />
	{/if}
{/if}
