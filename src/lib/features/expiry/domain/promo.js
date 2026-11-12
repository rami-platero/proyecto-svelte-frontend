/** @import { Batch, PromoAdvice } from '#lib/features/expiry/types.js' */
/** @import { Product } from '#lib/features/products/types.js' */
/** @import { SalesSignal } from '#lib/features/movements/types.js' */
import { PROMO_MAX_DISCOUNT, PROMO_MIN_DISCOUNT } from './constants.js';
import { daysUntil } from './expiry.js';

/**
 * @param {number} value
 * @returns {number}
 */
function roundTo5(value) {
	return Math.round(value / 5) * 5;
}

/**
 * Qué conviene hacer con un lote que se acerca al vencimiento.
 *
 * Importante: la app no sabe cuánto aumenta la venta al bajar el precio (no
 * tiene datos de elasticidad). Por eso el descuento es una heurística sobre
 * cuánto hay que acelerar la venta, y se muestra siempre junto a los datos que
 * lo originan. Si no hay historial suficiente, no proyecta nada y lo dice.
 *
 * @param {Batch} batch
 * @param {Product} product
 * @param {SalesSignal} signal
 * @returns {PromoAdvice}
 */
export function promoAdvice(batch, product, signal) {
	const days = daysUntil(batch.expires_at);
	const unitPrice = Number(product?.price) || 0;

	if (days < 0) {
		return {
			level: 'expired',
			days,
			unitsAtRisk: batch.quantity,
			valueAtRisk: batch.quantity * unitPrice,
			projectedSales: null,
			discount: null,
			headline: 'Dar de baja',
			detail:
				'El lote está vencido: ' +
				batch.quantity +
				' unidades no se pueden vender. Registrá la merma para que el stock refleje la realidad.',
			basis: 'Dato cierto: la fecha de vencimiento ya pasó.'
		};
	}

	if (signal.perDay === null) {
		return {
			level: 'no-data',
			days,
			unitsAtRisk: null,
			valueAtRisk: null,
			projectedSales: null,
			discount: null,
			headline: days <= 7 ? 'Revisar a mano' : 'Sin datos para proyectar',
			detail:
				days <= 7
					? 'Vence en ' +
						days +
						' días y hay ' +
						batch.quantity +
						' unidades. No hay historial suficiente para saber si se van a vender: decidilo con tu criterio.'
					: 'Todavía no se puede estimar si este lote llega a venderse antes de vencer.',
			basis: signal.reason
		};
	}

	const projectedSales = signal.perDay * days;
	const unitsAtRisk = Math.max(Math.round(batch.quantity - projectedSales), 0);

	if (unitsAtRisk === 0) {
		return {
			level: 'none',
			days,
			unitsAtRisk: 0,
			valueAtRisk: 0,
			projectedSales,
			discount: null,
			headline: 'No hace falta promo',
			detail:
				'Al ritmo observado se venderían unas ' +
				Math.round(projectedSales) +
				' unidades antes del vencimiento, más que las ' +
				batch.quantity +
				' del lote.',
			basis: signal.reason
		};
	}

	const requiredPerDay = batch.quantity / Math.max(days, 1);
	const acceleration = requiredPerDay / signal.perDay;
	const discount = Math.min(
		Math.max(roundTo5(PROMO_MIN_DISCOUNT * acceleration), PROMO_MIN_DISCOUNT),
		PROMO_MAX_DISCOUNT
	);

	/** @type {'watch' | 'promote' | 'clear'} */
	let level = 'watch';
	let headline = 'Vigilar';

	if (acceleration > 4) {
		level = 'clear';
		headline = 'Liquidar';
	} else if (acceleration > 1.25) {
		level = 'promote';
		headline = 'Promocionar';
	}

	return {
		level,
		days,
		unitsAtRisk,
		valueAtRisk: unitsAtRisk * unitPrice,
		projectedSales,
		discount: level === 'watch' ? null : discount,
		headline,
		detail:
			'Quedan ' +
			batch.quantity +
			' unidades y faltan ' +
			days +
			' días. Al ritmo actual se venderían unas ' +
			Math.round(projectedSales) +
			': sobrarían ' +
			unitsAtRisk +
			'. Para vaciarlo habría que vender ' +
			acceleration.toFixed(1) +
			' veces más rápido.',
		basis: signal.reason
	};
}
