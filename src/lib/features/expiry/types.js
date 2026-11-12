/**
 * @typedef {object} Batch
 * @property {number} id
 * @property {number} product_id
 * @property {string | null} code
 * @property {string} expires_at
 * @property {number} quantity
 * @property {string} [created_at]
 * @property {string} product Nombre del producto, resuelto en la consulta.
 * @property {string} sku
 * @property {string} unit
 * @property {number} price
 * @property {number} [days_left] Calculado por la vista batch_rows.
 */

/**
 * @typedef {object} ExpiryStatus
 * @property {'expired' | 'critical' | 'soon' | 'ok'} id
 * @property {string} label
 * @property {'danger' | 'warn' | 'ok'} tone
 */

/**
 * @typedef {object} PromoAdvice
 * @property {'expired' | 'no-data' | 'none' | 'watch' | 'promote' | 'clear'} level
 * @property {number} days
 * @property {number | null} unitsAtRisk
 * @property {number | null} valueAtRisk
 * @property {number | null} projectedSales
 * @property {number | null} discount
 * @property {string} headline
 * @property {string} detail
 * @property {string} basis
 */

/**
 * @typedef {object} BatchQuery
 * @property {number} [page]
 * @property {number} [perPage]
 * @property {number} [withinDays]
 */

/**
 * @typedef {object} BatchPage
 * @property {Batch[]} items
 * @property {number} total
 */

export {};
