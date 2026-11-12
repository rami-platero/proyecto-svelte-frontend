<script>
	import { Skeleton } from '#lib/shared/components/ui/skeleton/index.js';

	/** @type {{ rows?: number }} */
	let { rows = 4 } = $props();
</script>

<div class="grid gap-3 p-6" role="status" aria-label="Cargando movimientos">
	{#each Array(rows) as _, index (index)}
		<div class="flex items-center gap-3">
			<Skeleton class="size-8 rounded-full" />
			<div class="grid flex-1 gap-1.5">
				<Skeleton class="h-3.5 w-2/5" />
				<Skeleton class="h-3 w-1/4" />
			</div>
			<Skeleton class="h-6 w-16" />
		</div>
	{/each}
</div>
