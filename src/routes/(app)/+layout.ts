// src/routes/+layout.ts
import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load: LayoutLoad = async (event) => {
	const { session } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/login');
	}
	return { session };
};
