/**
 * API pública de la feature de productos.
 * El resto de la app importa desde acá, nunca de rutas internas.
 */
export { default as ProductList } from './components/ProductList.svelte';
export { default as ProductFilters } from './components/ProductFilters.svelte';
export { default as ProductFormDialog } from './components/ProductFormDialog.svelte';
export { default as ProductCombobox } from './components/ProductCombobox.svelte';
export { default as DeleteProductDialog } from './components/DeleteProductDialog.svelte';
export { default as ProductListSkeleton } from './components/ProductListSkeleton.svelte';
export { default as StockBadge } from './components/StockBadge.svelte';
export { default as StockBar } from './components/StockBar.svelte';
export { default as RestockPanel } from './components/RestockPanel.svelte';
export { default as ProductCard } from './components/ProductCard.svelte';

export {
	loadProductOptions,
	loadProducts,
	loadRestockList,
	productById,
	products,
	removeProduct,
	saveProduct
} from './state/products.svelte.js';

export {
	DEFAULT_FILTERS,
	activeFilterCount,
	ariaSortFor,
	filters,
	resetFilters,
	toggleSort
} from './state/filters.svelte.js';

export {
	getStockStatus,
	missingUnits,
	needsRestock,
	restockTarget,
	severityRank,
	stockRatio,
	STOCK_STATUS
} from './domain/stock.js';
