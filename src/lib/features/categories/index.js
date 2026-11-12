/** API pública de la feature de categorías. */
export { default as CategoryForm } from './components/CategoryForm.svelte';
export { default as CategoryList } from './components/CategoryList.svelte';
export { default as DeleteCategoryDialog } from './components/DeleteCategoryDialog.svelte';
export { default as CategoryListSkeleton } from './components/CategoryListSkeleton.svelte';

export {
	addCategory,
	categories,
	categoryExists,
	loadCategories,
	removeCategory
} from './state/categories.svelte.js';
