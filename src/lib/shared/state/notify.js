import { toast } from 'svelte-sonner';

export const notify = {
	/**
	 * @param {string} message
	 * @param {string} [hint]
	 */
	success: (message, hint) => toast.success(message, { description: hint }),
	/**
	 * @param {string} message
	 * @param {string} [hint]
	 */
	warn: (message, hint) => toast.warning(message, { description: hint, duration: 8000 }),
	/**
	 * @param {string} message
	 * @param {string} [hint]
	 */
	error: (message, hint) => toast.error(message, { description: hint, duration: 10000 }),
	/**
	 * @param {string} message
	 * @param {string} [hint]
	 */
	info: (message, hint) => toast.info(message, { description: hint })
};
