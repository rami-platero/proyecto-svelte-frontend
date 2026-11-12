/**
 * Errores de la app con un mensaje para mostrar y una pista accionable.
 * Traduce los códigos de Postgres/PostgREST a algo que el usuario entienda.
 */
export class AppError extends Error {
	/**
	 * @param {string} message
	 * @param {string} [hint]
	 */
	constructor(message, hint = '') {
		super(message);
		this.name = 'AppError';
		this.hint = hint;
	}
}

const MISSING_TABLE_CODES = ['42P01', 'PGRST205'];
const PERMISSION_CODES = ['42501', '42500'];

/**
 * @param {{ code?: string, message?: string, hint?: string } | null} error
 * @param {string} [fallback]
 * @returns {AppError}
 */
export function toAppError(error, fallback = 'No se pudo completar la operación.') {
	if (!error) return new AppError(fallback);

	const code = error.code ?? '';
	const message = error.message ?? fallback;

	// El detalle crudo de Postgres se conserva: sin él, un error de columna
	// faltante se confunde con uno de tabla faltante y se depura a ciegas.
	const detail = [code, message, error.hint].filter(Boolean).join(' · ');

	if (MISSING_TABLE_CODES.includes(code) || /does not exist|no existe/i.test(message)) {
		return new AppError(
			'Las tablas del inventario todavía no existen en Supabase.',
			'Ejecutá supabase/schema.sql y supabase/expiry.sql en el SQL Editor. Detalle: ' + detail
		);
	}

	if (PERMISSION_CODES.includes(code) || /row.?level|permission denied|policy/i.test(message)) {
		return new AppError(
			'La clave pública no tiene permisos sobre esa tabla.',
			'Volvé a ejecutar la sección de políticas RLS de supabase/schema.sql. Detalle: ' + detail
		);
	}

	if (code === '23505') {
		return new AppError(
			'Ya existe un registro con ese código.',
			'El SKU y el nombre de categoría no se pueden repetir.'
		);
	}

	if (code === '23503') {
		return new AppError(
			'Hay registros relacionados que impiden la operación.',
			'Revisá los productos asociados antes de borrar la categoría.'
		);
	}

	if (code === '23514' || /insuficiente/i.test(message)) {
		return new AppError(message);
	}

	if (/failed to fetch|network/i.test(message)) {
		return new AppError(
			'No hay conexión con Supabase.',
			'Verificá tu conexión a internet y que la URL del proyecto sea correcta.'
		);
	}

	return new AppError(message);
}

/**
 * Desempaqueta una respuesta de Supabase o lanza un AppError.
 * @template T
 * @param {{ data: T, error: any }} response
 * @param {string} [fallback]
 * @returns {T}
 */
export function unwrap(response, fallback) {
	if (response.error) throw toAppError(response.error, fallback);
	return response.data;
}
