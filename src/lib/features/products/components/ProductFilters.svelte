<script>
	/** @import { Category } from '#lib/features/categories/types.js' */
	import SearchIcon from '@lucide/svelte/icons/search';
	import XIcon from '@lucide/svelte/icons/x';
	import FormField from '#lib/shared/components/forms/FormField.svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Card, CardContent } from '#lib/shared/components/ui/card/index.js';
	import { Input } from '#lib/shared/components/ui/input/index.js';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '#lib/shared/components/ui/select/index.js';
	import { SORT_OPTIONS, STOCK_FILTERS } from '#lib/features/products/domain/constants.js';
	import { activeFilterCount, filters, resetFilters } from '#lib/features/products/state/filters.svelte.js';

	/** @type {{ categories?: Category[], shown?: number, total?: number }} */
	let { categories = [], shown = 0, total = 0 } = $props();

	const applied = $derived(activeFilterCount());

	const categoryLabel = $derived(
		filters.category === 'all'
			? 'Todas las categorías'
			: (categories.find((category) => String(category.id) === filters.category)?.name ??
				'Todas las categorías')
	);
	const statusLabel = $derived(
		STOCK_FILTERS.find((option) => option.value === filters.status)?.label ?? 'Todos'
	);
	const sortLabel = $derived(
		SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ?? 'Nombre'
	);
</script>

<Card>
	<CardContent class="grid gap-3">
		<h2 class="sr-only">Filtros del listado</h2>

		<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-[2fr_repeat(3,minmax(0,1fr))]">
			<FormField label="Buscar">
				{#snippet children({ id })}
					<div class="relative">
						<SearchIcon
							class="text-muted-foreground pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2"
						/>
						<Input
							{id}
							type="search"
							bind:value={filters.query}
							placeholder="Nombre, SKU o categoría"
							autocomplete="off"
							class="ps-8"
						/>
					</div>
				{/snippet}
			</FormField>

			<FormField label="Categoría">
				{#snippet children({ id })}
					<Select type="single" bind:value={filters.category}>
						<SelectTrigger {id} class="w-full">{categoryLabel}</SelectTrigger>
						<SelectContent>
							<SelectItem value="all" label="Todas las categorías">
								Todas las categorías
							</SelectItem>
							{#each categories as category (category.id)}
								<SelectItem value={String(category.id)} label={category.name}>
									{category.name}
								</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				{/snippet}
			</FormField>

			<FormField label="Estado de stock">
				{#snippet children({ id })}
					<Select type="single" bind:value={filters.status}>
						<SelectTrigger {id} class="w-full">{statusLabel}</SelectTrigger>
						<SelectContent>
							{#each STOCK_FILTERS as option (option.value)}
								<SelectItem value={option.value} label={option.label}>{option.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				{/snippet}
			</FormField>

			<FormField label="Ordenar por">
				{#snippet children({ id })}
					<Select type="single" bind:value={filters.sort}>
						<SelectTrigger {id} class="w-full">{sortLabel}</SelectTrigger>
						<SelectContent>
							{#each SORT_OPTIONS as option (option.value)}
								<SelectItem value={option.value} label={option.label}>{option.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				{/snippet}
			</FormField>
		</div>

		<div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm">
			<p aria-live="polite">
				{#if applied > 0}
					Mostrando <strong class="text-foreground">{shown}</strong> de {total} productos.
				{:else}
					{total} productos en el inventario.
				{/if}
			</p>
			{#if applied > 0}
				<Button variant="ghost" size="sm" onclick={resetFilters}>
					<XIcon />
					Limpiar filtros
				</Button>
			{/if}
		</div>
	</CardContent>
</Card>
