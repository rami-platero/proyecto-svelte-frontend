<script>
	import {
		CategoryForm,
		CategoryList,
		CategoryListSkeleton,
		DeleteCategoryDialog,
		categories
	} from '#lib/features/categories/index.js';
	import ErrorAlert from '#lib/shared/components/feedback/ErrorAlert.svelte';
	import SupabaseSetupNotice from '#lib/shared/components/feedback/SupabaseSetupNotice.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '#lib/shared/components/ui/card/index.js';
	import { APP_NAME } from '#lib/shared/config/app.js';
	import { dismissError, status } from '#lib/shared/state/status.svelte.js';
	import { configured, refreshAll } from '#lib/layout/state/bootstrap.svelte.js';

	/** @type {import('#lib/features/categories/types.js').CategoryWithStats | null} */
	let deleting = $state(null);

	const rows = $derived(categories.items);
</script>

<svelte:head>
	<title>Categorías · {APP_NAME}</title>
</svelte:head>

<div class="grid gap-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Categorías</h1>
		<p class="text-muted-foreground mt-1 max-w-[60ch] text-sm">
			Clasificación de los productos del inventario. Sirve para filtrar el listado de stock.
		</p>
	</div>

	{#if !configured}
		<SupabaseSetupNotice />
	{:else}
		{#if status.error}
			<ErrorAlert error={status.error} onretry={refreshAll} ondismiss={dismissError} />
		{/if}

		<div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
			<Card>
				<CardHeader>
					<CardTitle>Nueva categoría</CardTitle>
				</CardHeader>
				<CardContent>
					<CategoryForm />
				</CardContent>
			</Card>

			<Card class="gap-0 py-0">
				<CardHeader class="border-b py-4">
					<CardTitle>Categorías cargadas</CardTitle>
				</CardHeader>
				<CardContent class="px-0">
					{#if status.loading && !status.loaded}
						<CategoryListSkeleton />
					{:else}
						<CategoryList categories={rows} ondelete={(category) => (deleting = category)} />
					{/if}
				</CardContent>
			</Card>
		</div>
	{/if}
</div>

<DeleteCategoryDialog category={deleting} onclose={() => (deleting = null)} />
