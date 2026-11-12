/** @import { Product, ProductInput, ProductQuery } from '../types.js' */
import { load, run } from '#lib/shared/state/status.svelte.js';
import {
	createProduct,
	deleteProduct,
	fetchProductOptions,
	fetchProducts,
	fetchRestockList,
	updateProduct
} from '../api/products.service.js';

/**
 * Ya no guarda el catálogo entero: `items` es solo la página que se está
 * mostrando y `total` es cuántas filas matchean el filtro en la base.
 *
 * @type {{ items: Product[], total: number, options: Product[], restock: Product[] }}
 */
export const products = $state({
	items: [],
	total: 0,
	/** Catálogo liviano para los selectores (combobox de movimientos). */
	options: [],
	/** Lista corta de productos bajo el mínimo, para el panel y las alertas. */
	restock: []
});

/**
 * @param {ProductQuery} query
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadProducts(query, { silent = false } = {}) {
	const result = await load(() => fetchProducts(query), {
		fallback: 'No se pudieron leer los productos.',
		silent
	});

	if (result) {
		products.items = result.items;
		products.total = result.total;
	}
}

/**
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadProductOptions({ silent = false } = {}) {
	const result = await load(() => fetchProductOptions(), {
		fallback: 'No se pudieron leer los productos.',
		silent
	});
	if (result) products.options = result;
}

/**
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadRestockList({ silent = false } = {}) {
	const result = await load(() => fetchRestockList(), {
		fallback: 'No se pudieron leer los productos a reponer.',
		silent
	});
	if (result) products.restock = result;
}

/**
 * @param {string | number} id
 * @returns {Product | null}
 */
export function productById(id) {
	return (
		products.options.find((product) => String(product.id) === String(id)) ??
		products.items.find((product) => String(product.id) === String(id)) ??
		null
	);
}

/**
 * @param {ProductInput} values
 * @param {number | null} [id]
 * @returns {Promise<boolean>}
 */
export async function saveProduct(values, id = null) {
	const saved = await run(() => (id ? updateProduct(id, values) : createProduct(values)), {
		fallback: 'No se pudo guardar el producto.',
		success: (product) =>
			id ? 'Producto actualizado: ' + product.name : 'Producto agregado: ' + product.name
	});

	return Boolean(saved);
}

/**
 * @param {Product} product
 * @returns {Promise<boolean>}
 */
export async function removeProduct(product) {
	const done = await run(() => deleteProduct(product.id), {
		fallback: 'No se pudo borrar el producto.',
		success: () => 'Producto borrado: ' + product.name
	});

	return done !== null;
}
