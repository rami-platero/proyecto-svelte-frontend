/** @import { Category, CategoryWithStats } from '../types.js' */
import { load, run } from '#lib/shared/state/status.svelte.js';
import { createCategory, deleteCategory, fetchCategories } from '../api/categories.service.js';

/** @type {{ items: CategoryWithStats[] }} */
export const categories = $state({ items: [] });

/**
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadCategories({ silent = false } = {}) {
	const result = await load(() => fetchCategories(), {
		fallback: 'No se pudieron leer las categorías.',
		silent
	});
	if (result) categories.items = result;
}

/**
 * @param {string} name
 * @returns {Promise<Category | null>}
 */
export async function addCategory(name) {
	const created = await run(() => createCategory(name), {
		fallback: 'No se pudo crear la categoría.',
		success: (category) => 'Categoría creada: ' + category.name
	});

	if (created) await loadCategories({ silent: true });
	return created;
}

/**
 * @param {Category} category
 * @returns {Promise<boolean>}
 */
export async function removeCategory(category) {
	const done = await run(() => deleteCategory(category.id), {
		fallback: 'No se pudo borrar la categoría.',
		success: () => 'Categoría borrada: ' + category.name
	});

	if (done === null) return false;
	await loadCategories({ silent: true });
	return true;
}

/**
 * @param {string} name
 * @returns {boolean}
 */
export function categoryExists(name) {
	return categories.items.some(
		(category) => category.name.toLowerCase() === name.trim().toLowerCase()
	);
}
