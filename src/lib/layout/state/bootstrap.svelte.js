import { isSupabaseConfigured, subscribeToTable } from '#lib/shared/api/client.js';
import { status } from '#lib/shared/state/status.svelte.js';
import { loadCategories } from '#lib/features/categories/state/categories.svelte.js';
import { loadSummary } from '#lib/features/dashboard/state/summary.svelte.js';
import { loadProductOptions } from '#lib/features/products/state/products.svelte.js';

export const configured = isSupabaseConfigured;

/**
 * Carga lo que necesita el shell en cualquier pantalla: los totales (para los
 * contadores del sidebar), las categorías y el catálogo liviano para los
 * selectores.
 *
 * Cada pantalla pide aparte su propia página de datos, con su filtro y su
 * paginación resueltos por la base.
 *
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<void>}
 */
export async function loadShell({ silent = false } = {}) {
	if (!configured) {
		status.loaded = true;
		return;
	}

	await Promise.all([
		loadSummary({ silent }),
		loadCategories({ silent }),
		loadProductOptions({ silent })
	]);
}

/**
 * Lo que cada pantalla vuelve a pedir después de un cambio de stock, para no
 * quedar mostrando datos viejos.
 *
 * @type {Set<() => void | Promise<void>>}
 */
const refreshers = new Set();

/**
 * Registra un refresco de pantalla mientras esté montada.
 *
 * @param {() => void | Promise<void>} refresh
 * @returns {() => void}
 */
export function onDataChange(refresh) {
	refreshers.add(refresh);
	return () => refreshers.delete(refresh);
}

/**
 * Recarga los datos compartidos y la pantalla actual.
 *
 * @returns {Promise<void>}
 */
export async function refreshAll() {
	await loadShell({ silent: true });
	await Promise.all([...refreshers].map((refresh) => refresh()));
}

/**
 * Suscribe la app a los cambios de stock hechos desde otra pestaña o persona.
 * @returns {() => void}
 */
export function startRealtime() {
	if (!configured) return () => {};

	try {
		return subscribeToTable('products', () => {
			void refreshAll();
		});
	} catch {
		return () => {};
	}
}
