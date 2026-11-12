/**
 * Estado de los filtros del listado. Ya no filtra en memoria: estos valores
 * se mandan a la base en cada consulta y se reflejan en la URL, así el
 * listado es compartible y el navegador puede volver atrás.
 */

/** @type {{ query: string, category: string, status: string, sort: string, direction: 'asc' | 'desc', page: string }} */
export const DEFAULT_FILTERS = {
	query: '',
	category: 'all',
	status: 'all',
	sort: 'name',
	direction: /** @type {'asc'} */ ('asc'),
	page: '1'
};

/** @type {typeof DEFAULT_FILTERS} */
export const filters = $state({ ...DEFAULT_FILTERS });

export function resetFilters() {
	Object.assign(filters, DEFAULT_FILTERS);
}

/**
 * @returns {number}
 */
export function activeFilterCount() {
	let count = 0;
	if (filters.query.trim()) count += 1;
	if (filters.category !== 'all') count += 1;
	if (filters.status !== 'all') count += 1;
	return count;
}

/**
 * Cambiar el orden vuelve a la primera página: quedarse en la página 7 de un
 * orden distinto no tiene sentido para quien lo usa.
 *
 * @param {string} column
 */
export function toggleSort(column) {
	if (filters.sort === column) {
		filters.direction = filters.direction === 'asc' ? 'desc' : 'asc';
	} else {
		filters.sort = column;
		filters.direction = column === 'name' ? 'asc' : 'desc';
	}
	filters.page = '1';
}

/**
 * @param {string} column
 * @returns {'none' | 'ascending' | 'descending'}
 */
export function ariaSortFor(column) {
	if (filters.sort !== column) return 'none';
	return filters.direction === 'asc' ? 'ascending' : 'descending';
}
