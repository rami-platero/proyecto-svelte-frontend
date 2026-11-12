<script>
	import { Skeleton } from '#lib/shared/components/ui/skeleton/index.js';
</script>

<div class="grid gap-6" role="status" aria-label="Cargando el panel">
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
		{#each Array(5) as _, index (index)}
			<Skeleton class="h-24 rounded-xl" />
		{/each}
	</div>
	<Skeleton class="h-64 rounded-xl" />
	<div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
		<Skeleton class="h-80 rounded-xl" />
		<Skeleton class="h-80 rounded-xl" />
	</div>
</div>
