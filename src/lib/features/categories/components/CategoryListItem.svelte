<script>
	/** @import { CategoryWithStats } from '../types.js' */
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Badge } from '#lib/shared/components/ui/badge/index.js';
	import { Button } from '#lib/shared/components/ui/button/index.js';

	/** @type {{ category: CategoryWithStats, ondelete?: (category: CategoryWithStats) => void }} */
	let { category, ondelete } = $props();
</script>

<li class="flex items-center gap-3 px-6 py-3">
	<div class="min-w-0 flex-1">
		<h3 class="text-sm font-semibold">{category.name}</h3>
		<p class="text-muted-foreground text-xs">
			{category.total}
			{category.total === 1 ? 'producto' : 'productos'}
		</p>
	</div>

	{#if category.alerts > 0}
		<Badge
			variant="outline"
			class="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
		>
			{category.alerts} para reponer
		</Badge>
	{/if}

	<Button
		variant="ghost"
		size="icon-sm"
		class="text-destructive"
		onclick={() => ondelete?.(category)}
	>
		<Trash2Icon />
		<span class="sr-only">Borrar categoría {category.name}</span>
	</Button>
</li>
