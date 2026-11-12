const currency = new Intl.NumberFormat('es-AR', {
	style: 'currency',
	currency: 'ARS',
	maximumFractionDigits: 0
});

const decimal = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

const dateTime = new Intl.DateTimeFormat('es-AR', {
	day: '2-digit',
	month: 'short',
	hour: '2-digit',
	minute: '2-digit'
});

const dateLong = new Intl.DateTimeFormat('es-AR', {
	day: '2-digit',
	month: 'long',
	year: 'numeric'
});

/**
 * @param {number | string} value
 * @returns {string}
 */
export function formatMoney(value) {
	return currency.format(Number(value) || 0);
}

/**
 * @param {number | string} value
 * @returns {string}
 */
export function formatNumber(value) {
	return decimal.format(Number(value) || 0);
}

/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function formatDateTime(value) {
	if (!value) return '';
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? '' : dateTime.format(parsed);
}

/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function formatDate(value) {
	if (!value) return '';
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? '' : dateLong.format(parsed);
}

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralize(count, singular, plural) {
	return count === 1 ? singular : plural;
}

/**
 * @param {number} count
 * @param {string} [unit]
 * @returns {string}
 */
export function formatUnits(count, unit = 'unidad') {
	const amount = formatNumber(count);
	if (unit === 'unidad') return amount + ' ' + pluralize(count, 'unidad', 'unidades');
	if (unit === 'caja') return amount + ' ' + pluralize(count, 'caja', 'cajas');
	if (unit === 'paquete') return amount + ' ' + pluralize(count, 'paquete', 'paquetes');
	return amount + ' ' + unit;
}
