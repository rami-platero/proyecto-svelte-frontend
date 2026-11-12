/** @import { Product, StockStatus } from '#lib/features/products/types.js' */
import { RESTOCK_TARGET_FACTOR } from './constants.js';

/** @type {Record<'out' | 'low' | 'ok', StockStatus>} */
export const STOCK_STATUS = {
	out: {
		id: 'out',
		label: 'Agotado',
		tone: 'danger',
		message: 'Sin unidades disponibles: hay que reponer con prioridad.'
	},
	low: {
		id: 'low',
		label: 'Stock bajo',
		tone: 'warn',
		message: 'Por debajo del mínimo definido: conviene reponer.'
	},
	ok: {
		id: 'ok',
		label: 'Stock normal',
		tone: 'ok',
		message: 'Por encima del mínimo definido.'
	}
};

/**
 * @param {Product} product
 * @returns {StockStatus}
 */
export function getStockStatus(product) {
	const stock = Number(product?.stock) || 0;
	const minimum = Number(product?.min_stock) || 0;
	if (stock <= 0) return STOCK_STATUS.out;
	if (stock <= minimum) return STOCK_STATUS.low;
	return STOCK_STATUS.ok;
}

/**
 * @param {Product} product
 * @returns {boolean}
 */
export function needsRestock(product) {
	return getStockStatus(product).id !== 'ok';
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function restockTarget(product) {
	const minimum = Number(product?.min_stock) || 0;
	return Math.max(minimum * RESTOCK_TARGET_FACTOR, minimum + 1);
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function missingUnits(product) {
	const stock = Number(product?.stock) || 0;
	return Math.max(restockTarget(product) - stock, 0);
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function stockRatio(product) {
	const stock = Number(product?.stock) || 0;
	const target = restockTarget(product);
	if (target <= 0) return stock > 0 ? 1 : 0;
	return Math.min(stock / target, 1);
}

/**
 * @param {Product} product
 * @returns {number}
 */
export function severityRank(product) {
	const status = getStockStatus(product).id;
	if (status === 'out') return 0;
	if (status === 'low') return 1;
	return 2;
}

/**
 * @param {Product[]} products
 * @returns {number}
 */
export function inventoryValue(products) {
	return products.reduce(
		(total, product) => total + (Number(product.stock) || 0) * (Number(product.price) || 0),
		0
	);
}

/**
 * @param {Product[]} products
 * @returns {number}
 */
export function totalUnits(products) {
	return products.reduce((total, product) => total + (Number(product.stock) || 0), 0);
}
