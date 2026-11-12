<script>
	/** @import { CategoryWithStats } from '../types.js' */
	import TagIcon from '@lucide/svelte/icons/tag';
	import EmptyState from '#lib/shared/components/feedback/EmptyState.svelte';
	import CategoryListItem from './CategoryListItem.svelte';

	/**
	 * @type {{
	 *   categories?: CategoryWithStats[],
	 *   ondelete?: (category: CategoryWithStats) => void
	 * }}
	 */
	let { categories = [], ondelete } = $props();
</script>

{#if categories.length === 0}
	<EmptyState
		icon={TagIcon}
		title="Sin categorías"
		description="Creá la primera categoría para poder clasificar los productos."
	/>
{:else}
	<ul class="divide-y">
		{#each categories as category (category.id)}
			<CategoryListItem {category} {ondelete} />
		{/each}
	</ul>
{/if}
