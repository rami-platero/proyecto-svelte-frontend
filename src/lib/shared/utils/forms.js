/**
 * @param {Record<string, string>} errors
 * @returns {boolean}
 */
export function hasErrors(errors) {
	return Object.keys(errors).length > 0;
}
