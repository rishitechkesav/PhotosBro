import type { RequestHandler } from './$types';
import { error as svelteError, json } from '@sveltejs/kit';
import type { ReplicateTrainPayload } from '$lib/replicate.server';
import { getAdminUserInfo, updateAdminUserInfo } from '$lib/db';
import { supabaseClientAdmin } from '$lib/db.server';
import { _generatePhotos } from '../../../prediction/+server';

export const POST: RequestHandler = async (event) => {
	try {
		const theme = event.url.searchParams.get('theme') || "";
		const prompt = event.url.searchParams.get('prompt') || "";
		const quantity = event.url.searchParams.get('quantity') || "";
		const payload = (await event.request.json()) as ReplicateTrainPayload;
		const { logs: _, ...rest } = payload;
		console.log('Payload', rest);
		const userID = event.params.slug;

		if (!userID) {
			throw new Error('ID not valid');
		}

		await updateAdminUserInfo(
			userID,
			{
				replicate_version_id: payload.version,
				replicate_train_status: payload.status,
				in_training: false,
				trained: true,
				end_training: new Date().toISOString()
			},
			supabaseClientAdmin
		);

		const userInfo = await getAdminUserInfo(userID, supabaseClientAdmin);

		await _generatePhotos(
			{
				theme,
				seed: undefined,
				prompt,
				quantity
			},
			userInfo
		);

		return json({});
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			console.error(error.cause);
			throw svelteError(500, { message: error.message });
		}
		throw svelteError(500);
	}
};
