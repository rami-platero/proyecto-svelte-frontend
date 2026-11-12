/** @import { Movement, SalesSignal } from '#lib/features/movements/types.js' */
import { SALES_MIN_EVENTS, SALES_MIN_WINDOW_DAYS, SALES_WINDOW_DAYS } from './constants.js';

const DAY = 86400000;

/**
 * Ritmo de venta observado de un producto, calculado solo con los movimientos
 * que la app realmente tiene. No extrapola ni rellena huecos: si hay poca
 * historia devuelve perDay en null y lo informa en el nivel de confianza.
 *
 * La ventana no es un número fijo de días: va desde el primer movimiento
 * registrado del producto hasta hoy (con un tope), porque dividir las ventas
 * por 30 días cuando el producto se cargó hace 3 daría un ritmo falso.
 *
 * @param {Movement[]} movements
 * @param {number | string} productId
 * @returns {SalesSignal}
 */
export function salesSignal(movements, productId) {
	const own = movements.filter((movement) => String(movement.product_id) === String(productId));

	if (own.length === 0) {
		return {
			events: 0,
			units: 0,
			windowDays: 0,
			perDay: null,
			confidence: 'none',
			reason: 'El producto todavía no tiene movimientos registrados.'
		};
	}

	const now = Date.now();
	const oldest = own.reduce(
		(min, movement) => Math.min(min, new Date(movement.created_at).getTime()),
		now
	);
	const observedDays = Math.min(Math.max(Math.round((now - oldest) / DAY), 1), SALES_WINDOW_DAYS);
	const cutoff = Math.min(oldest, now - observedDays * DAY);

	const exits = own.filter(
		(movement) => movement.type === 'outbound' && new Date(movement.created_at).getTime() >= cutoff
	);
	const units = exits.reduce((total, movement) => total + movement.quantity, 0);

	if (exits.length < SALES_MIN_EVENTS || observedDays < SALES_MIN_WINDOW_DAYS) {
		return {
			events: exits.length,
			units,
			windowDays: observedDays,
			perDay: null,
			confidence: 'none',
			reason:
				'Hacen falta al menos ' +
				SALES_MIN_EVENTS +
				' salidas y ' +
				SALES_MIN_WINDOW_DAYS +
				' días de historial para estimar un ritmo de venta. Van ' +
				exits.length +
				' salidas en ' +
				observedDays +
				' días.'
		};
	}

	const perDay = units / observedDays;

	/** @type {'low' | 'medium' | 'high'} */
	let confidence = 'low';
	if (exits.length >= 12 && observedDays >= 21) confidence = 'high';
	else if (exits.length >= 6) confidence = 'medium';

	return {
		events: exits.length,
		units,
		windowDays: observedDays,
		perDay,
		confidence,
		reason:
			units +
			' unidades en ' +
			exits.length +
			' salidas durante ' +
			observedDays +
			' días de historial.'
	};
}
