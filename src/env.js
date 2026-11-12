import { defineEnvVars } from '@sveltejs/kit/env';

/** @param {string | undefined} value */
const optionalText = (value) => (value ?? '').trim();

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		static: true,
		schema: optionalText,
		description: 'Project URL del proyecto de Supabase (Settings -> API).'
	},
	PUBLIC_SUPABASE_ANON_KEY: {
		public: true,
		static: true,
		schema: optionalText,
		description: 'API key publica (anon) del proyecto de Supabase.'
	}
});
