/** @import { InventorySummary } from '../types.js' */
import { getClient } from '#lib/shared/api/client.js';
import { unwrap } from '#lib/shared/api/errors.js';

/** Vista de una sola fila con todos los totales del panel y del sidebar. */
const VIEW = 'inventory_summary';

/** @type {InventorySummary} */
export const EMPTY_SUMMARY = {
	productCount: 0,
	totalUnits: 0,
	inventoryValue: 0,
	restockCount: 0,
	outOfStockCount: 0,
	categoryCount: 0,
	expiringCount: 0,
	expiredCount: 0
};

/**
 * Totales del inventario, contados por la base de datos en una sola consulta.
 * Antes esto se calculaba en el navegador recorriendo todos los productos, lo
 * que obligaba a traerlos todos aunque la pantalla mostrara diez.
 *
 * @returns {Promise<InventorySummary>}
 */
export async function fetchSummary() {
	const response = await getClient().from(VIEW).select('*').maybeSingle();
	const row = unwrap(response, 'No se pudieron leer los totales del inventario.');

	if (!row) return { ...EMPTY_SUMMARY };

	return {
		productCount: Number(row.product_count) || 0,
		totalUnits: Number(row.total_units) || 0,
		inventoryValue: Number(row.inventory_value) || 0,
		restockCount: Number(row.restock_count) || 0,
		outOfStockCount: Number(row.out_of_stock_count) || 0,
		categoryCount: Number(row.category_count) || 0,
		expiringCount: Number(row.expiring_count) || 0,
		expiredCount: Number(row.expired_count) || 0
	};
}
