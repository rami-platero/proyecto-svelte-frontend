/**
 * Conversión entre el string ISO (`YYYY-MM-DD`, lo que guarda Postgres en una
 * columna `date`) y el `CalendarDate` que usa el Calendar de shadcn-svelte.
 * Vive en shared porque no sabe nada del inventario: cualquier feature con un
 * campo de fecha puede reusarla.
 */
import { CalendarDate, parseDate } from '@internationalized/date';

/**
 * @param {string | null | undefined} value
 * @returns {CalendarDate | undefined}
 */
export function toCalendarDate(value) {
	if (!value) return undefined;
	try {
		return parseDate(value);
	} catch {
		return undefined;
	}
}

/**
 * @param {CalendarDate | undefined} date
 * @returns {string}
 */
export function fromCalendarDate(date) {
	return date ? date.toString() : '';
}

/**
 * @returns {CalendarDate}
 */
export function todayCalendarDate() {
	const now = new Date();
	return new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}
