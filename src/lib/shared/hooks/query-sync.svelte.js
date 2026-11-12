/**
 * Sincroniza un objeto `$state` con los search params de la URL, sin
 * depender de ninguna librería (SvelteKit solo): al entrar a la página, la
 * URL manda sobre el estado; después, cada cambio del estado se refleja en
 * la URL con un debounce, así los filtros quedan en el historial del
 * navegador, se pueden compartir como link y un botón puede llegar con un
 * filtro ya aplicado (ej. "?status=restock").
 *
 * La URL es un espejo, no la fuente de verdad del filtrado: eso lo sigue
 * haciendo el propio `$state` en memoria, que ya es instantáneo. Por eso el
 * reflejo hacia la URL puede ir con debounce sin que la UI se sienta lenta.
 *
 * Usa `goto(..., { shallow: true })`: solo actualiza la URL, sin correr
 * `load` ni navegar de verdad. No hace falta en una página que ya tiene sus
 * datos en memoria, como el listado de productos.
 */
import { goto } from '$app/navigation';
import { page } from '$app/state';

/**
 * @template {Record<string, string>} T
 * @param {T} state Objeto reactivo a sincronizar (se muta in place).
 * @param {T} defaults Valor por omisión de cada clave: si el estado lo
 *   iguala, esa clave se omite de la URL para que quede limpia.
 * @param {{ debounceMs?: number }} [options]
 */
export function syncStateWithQuery(state, defaults, { debounceMs = 300 } = {}) {
	const keys = /** @type {(keyof T & string)[]} */ (Object.keys(defaults));

	for (const key of keys) {
		const fromUrl = page.url.searchParams.get(key);
		state[key] = /** @type {T[typeof key]} */ (fromUrl ?? defaults[key]);
	}

	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	$effect(() => {
		/** @type {Record<string, string>} */
		const snapshot = {};
		for (const key of keys) snapshot[key] = state[key];

		clearTimeout(timer);
		timer = setTimeout(() => {
			const params = new URLSearchParams(page.url.searchParams.toString());
			for (const key of keys) {
				if (snapshot[key] === defaults[key] || !snapshot[key]) params.delete(key);
				else params.set(key, snapshot[key]);
			}

			const query = params.toString();
			goto(query ? page.url.pathname + '?' + query : page.url.pathname, {
				replace: true,
				shallow: true,
				reset: false
			});
		}, debounceMs);

		return () => clearTimeout(timer);
	});
}
