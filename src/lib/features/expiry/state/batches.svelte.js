/** @import { Batch, BatchQuery } from '../types.js' */
import { load } from '#lib/shared/state/status.svelte.js';
import { fetchHistoryForProducts } from '#lib/features/movements/api/movements.service.js';
import { fetchBatchesOf, fetchExpiringBatches } from '../api/batches.service.js';

/**
 * `history` son las salidas recientes de los productos de la página actual:
 * la sugerencia de promoción necesita el ritmo de venta real de cada uno, y
 * el listado de movimientos ya no lo tiene entero en memoria.
 *
 * @type {{ items: Batch[], total: number, history: import('#lib/features/movements/types.js').Movement[] }}
 */
export const batches = $state({ items: [], total: 0, history: [] });

/**
 * @param {BatchQuery} [query]
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadExpiringBatches(query = {}, { silent = false } = {}) {
	const result = await load(() => fetchExpiringBatches(query), {
		fallback: 'No se pudieron leer los lotes.',
		silent
	});

	if (!result) return;

	batches.items = result.items;
	batches.total = result.total;

	// Una sola consulta para el historial de todos los productos visibles.
	const productIds = [...new Set(result.items.map((batch) => batch.product_id))];
	const history = await load(() => fetchHistoryForProducts(productIds), {
		fallback: 'No se pudo leer el historial de ventas.',
		silent: true
	});
	batches.history = history ?? [];
}

/**
 * Lotes de un producto puntual. No usa el estado global: lo pide quien lo
 * necesita (el formulario de movimientos) y se queda con el resultado.
 *
 * @param {number | string} productId
 * @returns {Promise<Batch[]>}
 */
export async function loadBatchesOf(productId) {
	const result = await load(() => fetchBatchesOf(productId), {
		fallback: 'No se pudieron leer los lotes del producto.',
		silent: true
	});
	return result ?? [];
}
