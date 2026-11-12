/** @import { InventorySummary } from '../types.js' */
import { load } from '#lib/shared/state/status.svelte.js';
import { EMPTY_SUMMARY, fetchSummary } from '../api/summary.service.js';

/** @type {{ data: InventorySummary }} */
export const summary = $state({ data: { ...EMPTY_SUMMARY } });

/**
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadSummary({ silent = false } = {}) {
	const result = await load(() => fetchSummary(), {
		fallback: 'No se pudieron leer los totales del inventario.',
		silent
	});
	if (result) summary.data = result;
}
