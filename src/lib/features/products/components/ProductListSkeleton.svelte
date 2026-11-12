<script>
	import { Skeleton } from '#lib/shared/components/ui/skeleton/index.js';

	/** @type {{ rows?: number }} */
	let { rows = 6 } = $props();
</script>

<div class="grid gap-4" role="status" aria-label="Cargando productos">
	<Skeleton class="h-28 rounded-xl" />
	<div class="bg-card grid gap-px overflow-hidden rounded-xl border">
		{#each Array(rows) as _, index (index)}
			<div class="flex items-center gap-4 p-4">
				<Skeleton class="h-4 w-1/3" />
				<Skeleton class="h-4 w-20" />
				<Skeleton class="ms-auto h-4 w-24" />
			</div>
		{/each}
	</div>
</div>
