import type { RequestHandler } from './$types';
import { error as svelteError, json } from '@sveltejs/kit';
import type { ReplicatePredictionPayload } from '$lib/replicate.server';
import { supabaseClientAdmin } from '$lib/db.server';
import { getAdminUserInfo, handleError } from '$lib/db';

export const POST: RequestHandler = async (event) => {
	try {
		const payload = (await event.request.json()) as ReplicatePredictionPayload;
		const { logs: _, ...rest } = payload;
		console.log('Payload', rest);

		const userID = event.params.slug;

		if (!userID) {
			throw new Error('ID not valid');
		}

		const [url] = payload.output || [];
		if (url) {
			console.log('Upload image: ', url);
			const image = await fetch(url);
			handleError(
				await supabaseClientAdmin.storage
					.from('photos-generated')
					.upload(`${userID}/${payload.id}.jpg`, await image.arrayBuffer())
			);
			console.log('Upload completed');
		} else {
			throw new Error('Missing url', {
				cause: payload
			});
		}

		handleError(
			await supabaseClientAdmin.from('predictions').upsert({
				id: payload.id,
				user_id: userID,
				status: payload.status,
				completed_at: new Date().toISOString()
			})
		);
		console.log('Prediction updated');

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
