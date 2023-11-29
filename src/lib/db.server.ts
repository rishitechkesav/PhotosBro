// or use the static env
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { createClient as createClientBase } from '@supabase/supabase-js';
import { createClient } from '@supabase/auth-helpers-sveltekit';

export const supabaseClientAdmin = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE);

export const getSupabaseClient = async (session: {
	access_token: string;
	refresh_token: string;
}) => {
	const client = createClientBase(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
		auth: {
			persistSession: false
		}
	});
	await client.auth.setSession(session);
	return client;
};
