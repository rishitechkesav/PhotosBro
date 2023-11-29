import { createClient } from '@supabase/auth-helpers-sveltekit';
// or use the static env
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Database } from './supabase-types';

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY);

export function handleError<TError extends { message: string }>({
	error
}:
	| {
			error: null;
	  }
	| {
			error: TError;
	  }) {
	if (error) {
		throw new Error(error.message, {
			cause: error
		});
	}
}
export function handleErrorAndGetData<TData, TError extends { message: string }>({
	data,
	error
}:
	| {
			data: TData;
			error: null;
	  }
	| {
			data: null;
			error: TError;
	  }) {
	if (error) {
		throw new Error(error.message, {
			cause: error
		});
	} else if (data) {
		return data;
	} else {
		throw new Error('Missig db data');
	}
}

export type UserInfo = Database['public']['Tables']['user_info']['Row'];

export const getUserInfo = async (): Promise<UserInfo> => {
	const { error, data } = await supabaseClient
		.from('user_info')
		.select('*', { count: 'exact' })
		.single();
	if (!error) {
		return data;
	}
	return {
		id: '',
		paid: false,
		in_training: false,
		trained: false,
		counter: 0,
		created_at: null,
		end_training: null,
		instance_class: null,
		replicate_model_id: null,
		replicate_train_status: null,
		replicate_version_id: null,
		start_training: null
	};
};

export const getAdminUserInfo = async (userID: string, client: TypedSupabaseClient) =>
	handleErrorAndGetData(
		await client.from('user_info').select('*', { count: 'exact' }).eq('id', userID).single()
	);

export const checkUserPaid = async () => !!(await getUserInfo())?.paid;

export const checkUserInTraining = async () => !!(await getUserInfo())?.in_training;

export const checkUserTrained = async () => !!(await getUserInfo())?.trained;

export const updateAdminUserInfo = async (
	userID: string,
	body: Partial<Database['public']['Tables']['user_info']['Update']>,
	client: TypedSupabaseClient
) => {
	const { count, error } = await client.from('user_info').update(body).eq('id', userID);

	if (error) {
		throw new Error("Can't update user state", { cause: error });
	}
	if (count == 0) {
		throw new Error("Can't find user info");
	}
};
