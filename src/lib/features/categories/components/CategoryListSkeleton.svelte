<script>
	import { Skeleton } from '#lib/shared/components/ui/skeleton/index.js';

	/** @type {{ rows?: number }} */
	let { rows = 4 } = $props();
</script>

<div class="grid gap-3 p-6" role="status" aria-label="Cargando categorías">
	{#each Array(rows) as _, index (index)}
		<div class="flex items-center gap-3">
			<Skeleton class="h-4 w-1/3" />
			<Skeleton class="ms-auto h-6 w-16" />
		</div>
	{/each}
</div>
