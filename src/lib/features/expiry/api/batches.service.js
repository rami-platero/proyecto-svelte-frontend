/** @import { Batch, BatchQuery, BatchPage } from '#lib/features/expiry/types.js' */
import { getClient } from '#lib/shared/api/client.js';
import { unwrap } from '#lib/shared/api/errors.js';
import { EXPIRY_WARNING_DAYS } from '../domain/constants.js';

const TABLE = 'product_batches';

/** Vista de solo lectura: trae los datos del producto y los días restantes. */
const VIEW = 'batch_rows';

/**
 * @param {any} row
 * @returns {Batch}
 */
function normalizeBatch(row) {
	return {
		...row,
		quantity: Number(row.quantity) || 0,
		days_left: Number(row.days_left) || 0,
		product: row.product_name ?? 'Producto eliminado',
		sku: row.product_sku ?? '',
		unit: row.product_unit ?? 'unidad',
		price: Number(row.product_price) || 0
	};
}

/**
 * Una página de lotes que necesitan atención: vencidos o por vencer dentro
 * de la ventana configurada. El filtro y el orden los resuelve la base.
 *
 * @param {BatchQuery} [query]
 * @returns {Promise<BatchPage>}
 */
export async function fetchExpiringBatches(query = {}) {
	const { page = 1, perPage = 8, withinDays = EXPIRY_WARNING_DAYS } = query;

	const from = (page - 1) * perPage;
	const response = await getClient()
		.from(VIEW)
		.select('*', { count: 'exact' })
		.gt('quantity', 0)
		.lte('days_left', withinDays)
		.order('days_left', { ascending: true })
		.order('id', { ascending: true })
		.range(from, from + perPage - 1);

	const rows = unwrap(response, 'No se pudieron leer los lotes.') ?? [];
	return { items: rows.map(normalizeBatch), total: response.count ?? 0 };
}

/**
 * Lotes de un producto puntual, para los selectores del formulario.
 *
 * @param {number | string} productId
 * @returns {Promise<Batch[]>}
 */
export async function fetchBatchesOf(productId) {
	const response = await getClient()
		.from(VIEW)
		.select('*')
		.eq('product_id', productId)
		.gt('quantity', 0)
		.order('expires_at', { ascending: true });
	const rows = unwrap(response, 'No se pudieron leer los lotes del producto.') ?? [];
	return rows.map(normalizeBatch);
}

/**
 * @param {number} id
 * @returns {Promise<number>}
 */
export async function deleteBatch(id) {
	const response = await getClient().from(TABLE).delete().eq('id', id);
	unwrap(response, 'No se pudo borrar el lote.');
	return id;
}
