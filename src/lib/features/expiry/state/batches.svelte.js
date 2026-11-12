/** @import { Batch, BatchQuery } from '../types.js' */
import { load } from '#lib/shared/state/status.svelte.js';
import { fetchBatchesOf, fetchExpiringBatches } from '../api/batches.service.js';

/** @type {{ items: Batch[], total: number }} */
export const batches = $state({ items: [], total: 0 });

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

	if (result) {
		batches.items = result.items;
		batches.total = result.total;
	}
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
