/** @import { ProductInput } from '../types.js' */

const SKU_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-_]{1,23}$/;

/**
 * @param {ProductInput} values
 * @returns {Record<string, string>}
 */
export function validateProduct(values) {
	/** @type {Record<string, string>} */
	const errors = {};

	if (!values.name?.trim()) {
		errors.name = 'Escribí un nombre para el producto.';
	} else if (values.name.trim().length < 2) {
		errors.name = 'El nombre necesita al menos 2 caracteres.';
	}

	if (!values.sku?.trim()) {
		errors.sku = 'El código SKU es obligatorio.';
	} else if (!SKU_PATTERN.test(values.sku.trim())) {
		errors.sku = 'Usá entre 2 y 24 caracteres: letras, números, guiones.';
	}

	const stock = Number(values.stock);
	if (!Number.isFinite(stock) || stock < 0) {
		errors.stock = 'El stock debe ser un número de 0 o más.';
	} else if (!Number.isInteger(stock)) {
		errors.stock = 'El stock se expresa en unidades enteras.';
	}

	const minimum = Number(values.min_stock);
	if (!Number.isFinite(minimum) || minimum < 0) {
		errors.min_stock = 'El mínimo debe ser un número de 0 o más.';
	} else if (!Number.isInteger(minimum)) {
		errors.min_stock = 'El mínimo se expresa en unidades enteras.';
	}

	const price = Number(values.price);
	if (!Number.isFinite(price) || price < 0) {
		errors.price = 'El precio debe ser un número de 0 o más.';
	}

	return errors;
}
