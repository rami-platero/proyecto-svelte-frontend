/** @import { ErrorInfo } from '#lib/shared/types.js' */
import { AppError } from '#lib/shared/api/errors.js';
import { notify } from '#lib/shared/state/notify.js';

/**
 * Estado transversal de carga y error. Evita repetir el mismo try/catch en
 * cada acción de cada feature: `run()` se encarga de marcar ocupado, traducir
 * el error, avisar al usuario y devolver si salió bien.
 *
 * @type {{ loading: boolean, loaded: boolean, busy: boolean, error: ErrorInfo | null }}
 */
export const status = $state({
	loading: false,
	loaded: false,
	busy: false,
	error: null
});

export function dismissError() {
	status.error = null;
}

/**
 * @param {unknown} error
 * @param {string} fallback
 * @returns {AppError}
 */
export function captureError(error, fallback) {
	const resolved =
		error instanceof AppError
			? error
			: new AppError(error instanceof Error ? error.message : fallback);
	status.error = { message: resolved.message, hint: resolved.hint ?? '' };
	return resolved;
}

/**
 * Ejecuta una acción del usuario (alta, baja, movimiento) gestionando el
 * estado `busy`, el error y el aviso.
 *
 * @template T
 * @param {() => Promise<T>} action
 * @param {{ fallback: string, success?: (result: T) => string | null }} options
 * @returns {Promise<T | null>}
 */
export async function run(action, { fallback, success }) {
	status.busy = true;
	try {
		const result = await action();
		status.error = null;
		const message = success?.(result);
		if (message) notify.success(message);
		return result;
	} catch (error) {
		const resolved = captureError(error, fallback);
		notify.error(resolved.message, resolved.hint);
		return null;
	} finally {
		status.busy = false;
	}
}

/**
 * Igual que `run`, pero para la carga inicial de datos: usa `loading` en vez
 * de `busy` y puede ejecutarse en silencio (refrescos automáticos).
 *
 * @template T
 * @param {() => Promise<T>} action
 * @param {{ fallback: string, silent?: boolean }} options
 * @returns {Promise<T | null>}
 */
export async function load(action, { fallback, silent = false }) {
	if (!silent) status.loading = true;
	try {
		const result = await action();
		status.error = null;
		return result;
	} catch (error) {
		const resolved = captureError(error, fallback);
		if (!silent) notify.error(resolved.message, resolved.hint);
		return null;
	} finally {
		status.loading = false;
		status.loaded = true;
	}
}
