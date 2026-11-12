/** @import { Batch } from '#lib/features/expiry/types.js' */
/** @import { Product } from '#lib/features/products/types.js' */

/**
 * @typedef {object} Alert
 * @property {string} id
 * @property {'expiry' | 'stock'} source
 * @property {boolean} urgent
 * @property {string} titulo
 * @property {string} detalle
 * @property {string} accion
 * @property {string} href
 * @property {number} orden
 */

/**
 * Une las dos fuentes de alerta en una sola lista ordenada por urgencia real:
 * primero lo vencido, después lo agotado, después lo que vence pronto y por
 * último el stock bajo.
 *
 * Se le pasan los datos ya resueltos para que la función siga siendo pura y
 * testeable: no lee estado global ni consulta la base.
 *
 * @param {{
 *   batches: { batch: Batch, expired: boolean, days: number, detalle: string }[],
 *   products: { product: Product, outOfStock: boolean, detalle: string }[]
 * }} input
 * @returns {Alert[]}
 */
export function buildAlerts({ batches, products }) {
	/** @type {Alert[]} */
	const alerts = [];

	for (const { batch, expired, days, detalle } of batches) {
		alerts.push({
			id: 'lote-' + batch.id,
			source: 'expiry',
			urgent: expired,
			titulo: batch.product,
			detalle,
			accion: expired ? 'Dar de baja' : 'Ver sugerencia',
			href: '/vencimientos',
			orden: expired ? -1000 + days : days
		});
	}

	for (const { product, outOfStock, detalle } of products) {
		alerts.push({
			id: 'stock-' + product.id,
			source: 'stock',
			urgent: outOfStock,
			titulo: product.name,
			detalle,
			accion: 'Reponer',
			// Lleva directo al producto: el SKU es unico, asi el link cae en
			// un listado de un solo item en vez del listado completo.
			href: '/productos?query=' + encodeURIComponent(product.sku),
			orden: outOfStock ? -500 : 100
		});
	}

	return alerts.sort((a, b) => a.orden - b.orden);
}
