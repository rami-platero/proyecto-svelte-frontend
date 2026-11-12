<script>
	import { Skeleton } from '#lib/shared/components/ui/skeleton/index.js';

	/** @type {{ rows?: number }} */
	let { rows = 3 } = $props();
</script>

<div class="grid gap-3" role="status" aria-label="Cargando vencimientos">
	<div class="grid gap-3 sm:grid-cols-3">
		<Skeleton class="h-24 rounded-xl" />
		<Skeleton class="h-24 rounded-xl" />
		<Skeleton class="h-24 rounded-xl" />
	</div>
	<div class="bg-card grid gap-4 rounded-xl border p-6">
		{#each Array(rows) as _, index (index)}
			<div class="grid gap-2">
				<Skeleton class="h-4 w-1/3" />
				<Skeleton class="h-16 rounded-lg" />
			</div>
		{/each}
	</div>
</div>
