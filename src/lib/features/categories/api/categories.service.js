/** @import { Category, CategoryWithStats } from '#lib/features/categories/types.js' */
import { getClient } from '#lib/shared/api/client.js';
import { unwrap } from '#lib/shared/api/errors.js';

const TABLE = 'categories';

/** Vista de solo lectura: trae los conteos de productos ya calculados. */
const VIEW = 'category_rows';

/**
 * Categorías con la cantidad de productos y de alertas, contadas por la base.
 *
 * @returns {Promise<CategoryWithStats[]>}
 */
export async function fetchCategories() {
	const response = await getClient().from(VIEW).select('*').order('name');
	const rows = unwrap(response, 'No se pudieron leer las categorías.') ?? [];
	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		total: Number(row.product_count) || 0,
		alerts: Number(row.restock_count) || 0
	}));
}

/**
 * @param {string} name
 * @returns {Promise<Category>}
 */
export async function createCategory(name) {
	const response = await getClient()
		.from(TABLE)
		.insert({ name: name.trim() })
		.select('id, name')
		.single();
	return /** @type {Category} */ (unwrap(response, 'No se pudo crear la categoría.'));
}

/**
 * @param {number} id
 * @param {string} name
 * @returns {Promise<Category>}
 */
export async function renameCategory(id, name) {
	const response = await getClient()
		.from(TABLE)
		.update({ name: name.trim() })
		.eq('id', id)
		.select('id, name')
		.single();
	return /** @type {Category} */ (unwrap(response, 'No se pudo renombrar la categoría.'));
}

/**
 * @param {number} id
 * @returns {Promise<number>}
 */
export async function deleteCategory(id) {
	const response = await getClient().from(TABLE).delete().eq('id', id);
	unwrap(response, 'No se pudo borrar la categoría.');
	return id;
}
