/**
 * Paginación del lado del cliente sobre una lista reactiva.
 *
 * Vuelve a la página 1 cuando cambia la composición de la lista (filtros,
 * orden), pero no cuando solo cambian los datos de un item: así registrar un
 * movimiento no te saca de la página en la que estabas.
 *
 * @template T
 * @param {() => T[]} getItems
 * @param {{ perPage?: number | (() => number), signature?: (items: T[]) => string }} [options]
 */
export function createPagination(getItems, options = {}) {
	const perPageOption = options.perPage;
	const resolvePerPage =
		typeof perPageOption === 'function' ? perPageOption : () => perPageOption ?? 10;
	const signatureOf =
		options.signature ??
		((items) => items.map((item) => /** @type {any} */ (item)?.id ?? '').join(','));

	let page = $state(1);
	let lastSignature = '';

	const perPage = $derived(resolvePerPage());
	const items = $derived(getItems());

	$effect(() => {
		const signature = signatureOf(items);
		if (signature !== lastSignature) {
			lastSignature = signature;
			page = 1;
		}
	});

	return {
		get page() {
			return page;
		},
		set page(value) {
			page = value;
		},
		get perPage() {
			return perPage;
		},
		get total() {
			return items.length;
		},
		get items() {
			return items.slice((page - 1) * perPage, page * perPage);
		}
	};
}
