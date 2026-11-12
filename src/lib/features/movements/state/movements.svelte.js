/** @import { Movement, MovementInput, MovementQuery } from '../types.js' */
import { load, run } from '#lib/shared/state/status.svelte.js';
import { notify } from '#lib/shared/state/notify.js';
import { getStockStatus } from '#lib/features/products/domain/stock.js';
import { fetchMovements, fetchRecentMovements, registerMovement } from '../api/movements.service.js';

/** @type {{ items: Movement[], total: number, recent: Movement[] }} */
export const movements = $state({
	items: [],
	total: 0,
	/** Últimos movimientos para el panel, sin paginar. */
	recent: []
});

/**
 * @param {MovementQuery} query
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadMovements(query, { silent = false } = {}) {
	const result = await load(() => fetchMovements(query), {
		fallback: 'No se pudo leer el historial de movimientos.',
		silent
	});

	if (result) {
		movements.items = result.items;
		movements.total = result.total;
	}
}

/**
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadRecentMovements({ silent = false } = {}) {
	const result = await load(() => fetchRecentMovements(), {
		fallback: 'No se pudo leer el historial de movimientos.',
		silent
	});
	if (result) movements.recent = result;
}

/**
 * Registra el movimiento y avisa en qué estado quedó el producto.
 * Quien llama decide qué listados recargar después.
 *
 * @param {MovementInput} values
 * @returns {Promise<boolean>}
 */
export async function applyMovement(values) {
	const updated = await run(() => registerMovement(values), {
		fallback: 'No se pudo registrar el movimiento.'
	});

	if (!updated) return false;

	const state = getStockStatus(updated);
	if (state.id === 'out') {
		notify.warn('Movimiento registrado: ' + updated.name + ' quedó sin stock.', state.message);
	} else if (state.id === 'low') {
		notify.warn(
			'Movimiento registrado: ' + updated.name + ' quedó con stock bajo.',
			'Mínimo definido: ' + updated.min_stock + ' · stock actual: ' + updated.stock
		);
	} else {
		notify.success(
			'Movimiento registrado: ' + updated.name + ' con ' + updated.stock + ' en stock.'
		);
	}

	return true;
}
