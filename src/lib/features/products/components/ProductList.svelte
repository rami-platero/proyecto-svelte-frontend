<script>
	/** @import { Product } from '../types.js' */
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import Paginator from '#lib/shared/components/data/Paginator.svelte';
	import {
		Table,
		TableBody,
		TableCaption,
		TableHead,
		TableHeader,
		TableRow
	} from '#lib/shared/components/ui/table/index.js';
	import { ariaSortFor, filters, toggleSort } from '../state/filters.svelte.js';
	import ProductCard from './ProductCard.svelte';
	import ProductTableRow from './ProductTableRow.svelte';

	/**
	 * `products` es solo la página actual; `total` es cuántas filas matchean
	 * el filtro en la base.
	 *
	 * @type {{
	 *   products?: Product[],
	 *   total?: number,
	 *   perPage?: number,
	 *   onedit?: (product: Product) => void,
	 *   ondelete?: (product: Product) => void,
	 *   onmove?: (product: Product) => void
	 * }}
	 */
	let { products = [], total = 0, perPage = 10, onedit, ondelete, onmove } = $props();

	/** La página vive en los filtros, así queda también en la URL. */
	let page = $derived(Number(filters.page) || 1);

	/** @param {number} value */
	function goToPage(value) {
		filters.page = String(value);
	}

	const columns = [
		{ key: 'name', label: 'Producto', sortable: true },
		{ key: 'category', label: 'Categoría', sortable: false },
		{ key: 'status', label: 'Estado', sortable: false },
		{ key: 'stock', label: 'Stock', sortable: true },
		{ key: 'price', label: 'Precio', sortable: true }
	];
</script>

<div class="bg-card hidden overflow-x-auto rounded-xl border lg:block">
	<Table>
		<TableCaption class="sr-only">
			Productos del inventario con su nivel de stock, estado de reposición y precio unitario.
		</TableCaption>
		<TableHeader>
			<TableRow>
				{#each columns as column (column.key)}
					<TableHead aria-sort={column.sortable ? ariaSortFor(column.key) : undefined}>
						{#if column.sortable}
							<button
								type="button"
								class="hover:text-foreground inline-flex items-center gap-1 rounded"
								onclick={() => toggleSort(column.key)}
							>
								{column.label}
								{#if ariaSortFor(column.key) === 'ascending'}
									<ChevronUpIcon class="size-3.5" />
								{:else if ariaSortFor(column.key) === 'descending'}
									<ChevronDownIcon class="size-3.5" />
								{:else}
									<ChevronsUpDownIcon class="size-3.5 opacity-40" />
								{/if}
							</button>
						{:else}
							{column.label}
						{/if}
					</TableHead>
				{/each}
				<TableHead class="text-right"><span class="sr-only">Acciones</span></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each products as product (product.id)}
				<ProductTableRow {product} {onedit} {ondelete} {onmove} />
			{/each}
		</TableBody>
	</Table>

	<Paginator {page} {total} {perPage} label="productos" onchange={goToPage} />
</div>

<div class="grid gap-3 lg:hidden">
	<ul class="grid gap-3 sm:grid-cols-2">
		{#each products as product (product.id)}
			<li>
				<ProductCard {product} {onedit} {ondelete} {onmove} />
			</li>
		{/each}
	</ul>

	<div class="bg-card rounded-xl border">
		<Paginator {page} {total} {perPage} label="productos" onchange={goToPage} />
	</div>
</div>
