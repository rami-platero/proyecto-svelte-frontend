/**
 * @typedef {object} Product
 * @property {number} id
 * @property {string} sku
 * @property {string} name
 * @property {string | null} [description]
 * @property {number | null} category_id
 * @property {string} category Nombre de la categoría, resuelto en la consulta.
 * @property {string} unit
 * @property {number} stock
 * @property {number} min_stock
 * @property {number} price
 * @property {boolean} perishable
 * @property {'out' | 'low' | 'ok'} [stock_status] Calculado por la vista product_rows.
 * @property {number} [missing_units] Calculado por la vista product_rows.
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {object} ProductInput
 * @property {string} name
 * @property {string} sku
 * @property {string} [description]
 * @property {string | number | null} [category_id]
 * @property {string} [unit]
 * @property {string | number} [stock]
 * @property {string | number} [min_stock]
 * @property {string | number} [price]
 * @property {boolean} [perishable]
 */

/**
 * @typedef {object} StockStatus
 * @property {'out' | 'low' | 'ok'} id
 * @property {string} label
 * @property {'danger' | 'warn' | 'ok'} tone
 * @property {string} message
 */

/**
 * @typedef {object} ProductQuery
 * @property {number} [page]
 * @property {number} [perPage]
 * @property {string} [search]
 * @property {string} [category]
 * @property {string} [status]
 * @property {string} [sort]
 * @property {'asc' | 'desc'} [direction]
 */

/**
 * @typedef {object} ProductPage
 * @property {Product[]} items
 * @property {number} total Total de filas que matchean el filtro, no solo la página.
 */

export {};
