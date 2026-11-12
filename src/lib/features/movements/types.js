/**
 * @typedef {'inbound' | 'outbound' | 'adjustment'} MovementType
 */

/**
 * @typedef {object} Movement
 * @property {number} id
 * @property {number} product_id
 * @property {number | null} [batch_id]
 * @property {MovementType} type
 * @property {number} quantity
 * @property {number} resulting_stock
 * @property {string | null} reason
 * @property {string} created_at
 * @property {string} product Nombre del producto, resuelto en la consulta.
 * @property {string} sku
 * @property {string} unit
 */

/**
 * @typedef {object} MovementInput
 * @property {string | number} product_id
 * @property {MovementType | string} type
 * @property {string | number} quantity
 * @property {string} [reason]
 * @property {string | null} [expires_at]
 * @property {string | null} [batch_code]
 * @property {string | number | null} [batch_id]
 */

/**
 * @typedef {object} SalesSignal
 * @property {number} events
 * @property {number} units
 * @property {number} windowDays
 * @property {number | null} perDay
 * @property {'none' | 'low' | 'medium' | 'high'} confidence
 * @property {string} reason
 */

/**
 * @typedef {object} MovementQuery
 * @property {number} [page]
 * @property {number} [perPage]
 * @property {string} [search]
 * @property {string} [type]
 * @property {number | string | null} [productId]
 */

/**
 * @typedef {object} MovementPage
 * @property {Movement[]} items
 * @property {number} total
 */

export {};
