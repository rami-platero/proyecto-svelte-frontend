import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$app/env/public';
import { AppError } from './errors.js';

export const isSupabaseConfigured = Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY);

const client = isSupabaseConfigured
	? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			auth: { persistSession: false }
		})
	: null;

/**
 * Único punto de acceso al cliente. Falla con un mensaje claro si falta
 * configuración, en vez de explotar con un error de null más adelante.
 * @returns {NonNullable<typeof client>}
 */
export function getClient() {
	if (!client) {
		throw new AppError(
			'Faltan las credenciales de Supabase.',
			'Copiá .env.example a .env y pegá PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY.'
		);
	}
	return client;
}

/**
 * @param {string} name
 * @param {(payload: unknown) => void} onChange
 * @returns {() => void}
 */
export function subscribeToTable(name, onChange) {
	const supabase = getClient();
	const channel = supabase
		.channel('inventario-' + name)
		.on('postgres_changes', { event: '*', schema: 'public', table: name }, onChange)
		.subscribe();

	return () => {
		supabase.removeChannel(channel);
	};
}
