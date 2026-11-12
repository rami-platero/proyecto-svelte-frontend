/** @import { Product, ProductInput, ProductQuery, ProductPage } from '#lib/features/products/types.js' */
import { getClient } from '#lib/shared/api/client.js';
import { unwrap } from '#lib/shared/api/errors.js';

const TABLE = 'products';

/** Vista de solo lectura: trae la categoría resuelta y el estado de stock ya calculado. */
const VIEW = 'product_rows';

const WRITE_SELECT =
	'id, sku, name, description, unit, stock, min_stock, price, perishable, category_id, created_at, updated_at';

/**
 * @param {any} row
 * @returns {Product}
 */
export function normalizeProduct(row) {
	return {
		...row,
		stock: Number(row.stock) || 0,
		min_stock: Number(row.min_stock) || 0,
		price: Number(row.price) || 0,
		perishable: Boolean(row.perishable),
		category: row.category ?? 'Sin categoría',
		stock_status: row.stock_status ?? 'ok',
		missing_units: Number(row.missing_units) || 0
	};
}

/**
 * @param {ProductInput} values
 */
function toPayload(values) {
	return {
		sku: String(values.sku).trim().toUpperCase(),
		name: String(values.name).trim(),
		description: values.description?.trim() || null,
		category_id: values.category_id ? Number(values.category_id) : null,
		unit: values.unit || 'unidad',
		stock: Number(values.stock) || 0,
		min_stock: Number(values.min_stock) || 0,
		price: Number(values.price) || 0,
		perishable: Boolean(values.perishable)
	};
}

/**
 * Columnas por las que se puede ordenar, y su columna real en la vista.
 * @type {Record<string, string>}
 */
const SORT_COLUMNS = {
	name: 'name',
	stock: 'stock',
	price: 'price',
	missing: 'missing_units'
};

/**
 * Una página de productos, filtrada y ordenada por la base de datos.
 *
 * @param {ProductQuery} query
 * @returns {Promise<ProductPage>}
 */
export async function fetchProducts(query) {
	const { page = 1, perPage = 10, search = '', category = 'all', status = 'all' } = query;
	const sortColumn = SORT_COLUMNS[query.sort ?? 'name'] ?? 'name';
	const ascending = (query.direction ?? 'asc') === 'asc';

	let request = getClient()
		.from(VIEW)
		.select('*', { count: 'exact' })
		.order(sortColumn, { ascending })
		.order('id', { ascending: true });

	const text = search.trim();
	if (text) {
		// Escapa los comodines de PostgREST para que el texto se busque literal.
		const pattern = '*' + text.replace(/[*,()]/g, ' ').trim() + '*';
		request = request.or(
			['name.ilike.' + pattern, 'sku.ilike.' + pattern, 'category.ilike.' + pattern].join(',')
		);
	}

	if (category !== 'all') request = request.eq('category_id', Number(category));

	if (status === 'restock') request = request.in('stock_status', ['out', 'low']);
	else if (status !== 'all') request = request.eq('stock_status', status);

	const from = (page - 1) * perPage;
	const response = await request.range(from, from + perPage - 1);
	const rows = unwrap(response, 'No se pudieron leer los productos.') ?? [];

	return { items: rows.map(normalizeProduct), total: response.count ?? 0 };
}

/**
 * Lista corta de productos bajo el mínimo, para el panel y las alertas.
 *
 * @param {number} [limit]
 * @returns {Promise<Product[]>}
 */
export async function fetchRestockList(limit = 20) {
	const response = await getClient()
		.from(VIEW)
		.select('*')
		.in('stock_status', ['out', 'low'])
		.order('stock_status', { ascending: true })
		.order('missing_units', { ascending: false })
		.limit(limit);
	const rows = unwrap(response, 'No se pudieron leer los productos a reponer.') ?? [];
	return rows.map(normalizeProduct);
}

/**
 * Catálogo mínimo para los selectores (id, nombre, SKU, stock).
 * No pagina: son pocos campos y el combobox necesita poder buscar en todos.
 *
 * @returns {Promise<Product[]>}
 */
export async function fetchProductOptions() {
	const response = await getClient()
		.from(VIEW)
		.select('id, sku, name, unit, stock, min_stock, price, perishable, category, stock_status')
		.order('name');
	const rows = unwrap(response, 'No se pudieron leer los productos.') ?? [];
	return rows.map(normalizeProduct);
}

/**
 * @param {number | string} id
 * @returns {Promise<Product | null>}
 */
export async function fetchProduct(id) {
	const response = await getClient().from(VIEW).select('*').eq('id', id).maybeSingle();
	const row = unwrap(response, 'No se pudo leer el producto.');
	return row ? normalizeProduct(row) : null;
}

/**
 * @param {ProductInput} values
 * @returns {Promise<Product>}
 */
export async function createProduct(values) {
	const response = await getClient()
		.from(TABLE)
		.insert(/** @type {any} */ (toPayload(values)))
		.select(WRITE_SELECT)
		.single();
	const row = unwrap(response, 'No se pudo crear el producto.');
	return normalizeProduct(row);
}

/**
 * @param {number} id
 * @param {ProductInput} values
 * @returns {Promise<Product>}
 */
export async function updateProduct(id, values) {
	const response = await getClient()
		.from(TABLE)
		.update(/** @type {any} */ (toPayload(values)))
		.eq('id', id)
		.select(WRITE_SELECT)
		.single();
	const row = unwrap(response, 'No se pudo editar el producto.');
	return normalizeProduct(row);
}

/**
 * @param {number} id
 * @returns {Promise<number>}
 */
export async function deleteProduct(id) {
	const response = await getClient().from(TABLE).delete().eq('id', id);
	unwrap(response, 'No se pudo borrar el producto.');
	return id;
}
