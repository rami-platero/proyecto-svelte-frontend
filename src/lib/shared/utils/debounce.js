/**
 * Agrupa llamadas seguidas en una sola, esperando a que pasen `delay`
 * milisegundos sin nuevas llamadas. Se usa para que escribir en un buscador
 * no dispare una consulta por cada tecla.
 *
 * @template {(...args: any[]) => void} T
 * @param {T} fn
 * @param {number} [delay]
 * @returns {T & { cancel: () => void }}
 */
export function debounce(fn, delay = 250) {
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	const debounced = /** @type {any} */ (
		(/** @type {any[]} */ ...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => fn(...args), delay);
		}
	);

	debounced.cancel = () => clearTimeout(timer);
	return debounced;
}
