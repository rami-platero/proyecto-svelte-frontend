/** @import { Batch, ExpiryStatus } from '#lib/features/expiry/types.js' */
import { EXPIRY_CRITICAL_DAYS, EXPIRY_WARNING_DAYS } from './constants.js';

/** @type {Record<'expired' | 'critical' | 'soon' | 'ok', ExpiryStatus>} */
export const EXPIRY_STATUS = {
	expired: { id: 'expired', label: 'Vencido', tone: 'danger' },
	critical: { id: 'critical', label: 'Vence ya', tone: 'danger' },
	soon: { id: 'soon', label: 'Por vencer', tone: 'warn' },
	ok: { id: 'ok', label: 'En fecha', tone: 'ok' }
};

/**
 * Días enteros entre hoy y la fecha, comparando a medianoche local para que
 * "vence hoy" sea 0 y no una fracción.
 * @param {string} date
 * @returns {number}
 */
export function daysUntil(date) {
	const target = new Date(date + 'T00:00:00');
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return Math.round((target.getTime() - today.getTime()) / 86400000);
}

/**
 * @param {Batch} batch
 * @returns {ExpiryStatus}
 */
export function getExpiryStatus(batch) {
	const days = daysUntil(batch.expires_at);
	if (days < 0) return EXPIRY_STATUS.expired;
	if (days <= EXPIRY_CRITICAL_DAYS) return EXPIRY_STATUS.critical;
	if (days <= EXPIRY_WARNING_DAYS) return EXPIRY_STATUS.soon;
	return EXPIRY_STATUS.ok;
}

/**
 * @param {Batch} batch
 * @returns {boolean}
 */
export function needsAttention(batch) {
	return batch.quantity > 0 && getExpiryStatus(batch).id !== 'ok';
}

/**
 * @param {number} days
 * @returns {string}
 */
export function describeDays(days) {
	if (days < -1) return 'venció hace ' + Math.abs(days) + ' días';
	if (days === -1) return 'venció ayer';
	if (days === 0) return 'vence hoy';
	if (days === 1) return 'vence mañana';
	return 'vence en ' + days + ' días';
}

/**
 * @param {Batch} batch
 * @returns {number}
 */
export function severityRank(batch) {
	const status = getExpiryStatus(batch).id;
	if (status === 'expired') return 0;
	if (status === 'critical') return 1;
	if (status === 'soon') return 2;
	return 3;
}

/**
 * @param {Batch[]} batches
 * @returns {Batch[]}
 */
export function sortByUrgency(batches) {
	return [...batches].sort(
		(a, b) => severityRank(a) - severityRank(b) || daysUntil(a.expires_at) - daysUntil(b.expires_at)
	);
}
