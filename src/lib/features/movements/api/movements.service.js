/** @import { Movement, MovementInput, MovementQuery, MovementPage } from '#lib/features/movements/types.js' */
/** @import { Product } from '#lib/features/products/types.js' */
import { getClient } from '#lib/shared/api/client.js';
import { unwrap } from '#lib/shared/api/errors.js';
import { normalizeProduct } from '#lib/features/products/api/products.service.js';

/** Vista de solo lectura: trae el nombre y SKU del producto ya aplanados. */
const VIEW = 'movement_rows';

/**
 * @param {any} row
 * @returns {Movement}
 */
function normalizeMovement(row) {
	return {
		...row,
		quantity: Number(row.quantity) || 0,
		resulting_stock: Number(row.resulting_stock) || 0,
		product: row.product_name ?? 'Producto eliminado',
		sku: row.product_sku ?? '',
		unit: row.product_unit ?? 'unidad'
	};
}

/**
 * Una página del historial, filtrada y ordenada por la base de datos.
 *
 * @param {MovementQuery} query
 * @returns {Promise<MovementPage>}
 */
export async function fetchMovements(query = {}) {
	const { page = 1, perPage = 12, search = '', type = 'all', productId = null } = query;

	let request = getClient()
		.from(VIEW)
		.select('*', { count: 'exact' })
		.order('created_at', { ascending: false })
		.order('id', { ascending: false });

	const text = search.trim();
	if (text) {
		const pattern = '*' + text.replace(/[*,()]/g, ' ').trim() + '*';
		request = request.or(
			[
				'product_name.ilike.' + pattern,
				'product_sku.ilike.' + pattern,
				'reason.ilike.' + pattern
			].join(',')
		);
	}

	if (type !== 'all') request = request.eq('type', type);
	if (productId) request = request.eq('product_id', productId);

	const from = (page - 1) * perPage;
	const response = await request.range(from, from + perPage - 1);
	const rows = unwrap(response, 'No se pudo leer el historial de movimientos.') ?? [];

	return { items: rows.map(normalizeMovement), total: response.count ?? 0 };
}

/**
 * Movimientos recientes para el panel.
 *
 * @param {number} [limit]
 * @returns {Promise<Movement[]>}
 */
export async function fetchRecentMovements(limit = 6) {
	const response = await getClient()
		.from(VIEW)
		.select('*')
		.order('created_at', { ascending: false })
		.order('id', { ascending: false })
		.limit(limit);
	const rows = unwrap(response, 'No se pudo leer el historial de movimientos.') ?? [];
	return rows.map(normalizeMovement);
}

/**
 * Historial de salidas de un producto, para estimar su ritmo de venta.
 * Se pide por producto y acotado en el tiempo, en vez de traer todo.
 *
 * @param {number | string} productId
 * @param {number} [windowDays]
 * @returns {Promise<Movement[]>}
 */
export async function fetchProductHistory(productId, windowDays = 90) {
	const since = new Date(Date.now() - windowDays * 86400000).toISOString();
	const response = await getClient()
		.from(VIEW)
		.select('*')
		.eq('product_id', productId)
		.gte('created_at', since)
		.order('created_at', { ascending: false });
	const rows = unwrap(response, 'No se pudo leer el historial del producto.') ?? [];
	return rows.map(normalizeMovement);
}

/**
 * @param {MovementInput} values
 * @returns {Promise<Product | null>}
 */
export async function registerMovement({
	product_id,
	type,
	quantity,
	reason,
	expires_at,
	batch_code,
	batch_id
}) {
	const response = await getClient().rpc('register_movement', {
		p_product_id: Number(product_id),
		p_type: type,
		p_quantity: Number(quantity),
		p_reason: reason?.trim() || null,
		p_expires_at: expires_at || null,
		p_batch_code: batch_code?.trim() || null,
		p_batch_id: batch_id ? Number(batch_id) : null
	});
	const data = unwrap(response, 'No se pudo registrar el movimiento.');
	const row = Array.isArray(data) ? data[0] : data;
	return row ? normalizeProduct(row) : null;
}
