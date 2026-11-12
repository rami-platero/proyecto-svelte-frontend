export const UNITS = ['unidad', 'caja', 'pack', 'kg', 'litro', 'metro'];

/** Cuántas veces el stock mínimo se toma como objetivo al reponer. */
export const RESTOCK_TARGET_FACTOR = 2;

export const STOCK_FILTERS = [
	{ value: 'all', label: 'Todos' },
	{ value: 'restock', label: 'Para reponer' },
	{ value: 'out', label: 'Agotados' },
	{ value: 'ok', label: 'Con stock' }
];

export const SORT_OPTIONS = [
	{ value: 'name', label: 'Nombre' },
	{ value: 'stock', label: 'Stock' },
	{ value: 'price', label: 'Precio' },
	{ value: 'missing', label: 'Faltante' }
];
