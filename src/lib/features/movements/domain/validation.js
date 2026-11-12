/** @import { MovementInput } from '../types.js' */
/** @import { Product } from '#lib/features/products/types.js' */

/**
 * @param {MovementInput} values
 * @param {Product | null} product
 * @returns {Record<string, string>}
 */
export function validateMovement(values, product) {
	/** @type {Record<string, string>} */
	const errors = {};

	if (!values.product_id) {
		errors.product_id = 'Elegí un producto.';
	}

	const quantity = Number(values.quantity);
	if (!Number.isFinite(quantity) || !Number.isInteger(quantity)) {
		errors.quantity = 'La cantidad se expresa en unidades enteras.';
	} else if (values.type === 'adjustment' && quantity < 0) {
		errors.quantity = 'El stock final no puede ser negativo.';
	} else if (values.type !== 'adjustment' && quantity <= 0) {
		errors.quantity = 'La cantidad debe ser mayor que cero.';
	} else if (values.type === 'outbound' && product && quantity > Number(product.stock)) {
		errors.quantity = 'No hay tantas unidades: el stock actual es ' + product.stock + '.';
	}

	if (product?.perishable) {
		if (values.type === 'inbound' && !values.expires_at) {
			errors.expires_at = 'Es un producto perecedero: indicá cuándo vence el lote.';
		}

		if (values.type === 'adjustment' && !values.batch_id) {
			errors.batch_id = 'Elegí sobre qué lote se hace el ajuste.';
		}
	}

	return errors;
}
