import type { RequestHandler } from './$types';
import { error as svelteError, json } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { supabaseClientAdmin } from '$lib/db.server';
import { getAdminUserInfo, handleErrorAndGetData, updateAdminUserInfo } from '$lib/db';
import { PUBLIC_ENV } from '$env/static/public';
import { getTrainingStatus, runTrain } from '$lib/replicate.server';

// Update the train status
export const GET: RequestHandler = async (event) => {
	try {
		const { session } = await getSupabase(event);

		if (!session) {
			throw new Error('Session not valid');
		}
		const user = session.user;

		const userInfo = await getAdminUserInfo(session.user.id, supabaseClientAdmin);

		if (!userInfo.paid) {
			throw new Error('Payment required');
		}
		if (!userInfo.trained && userInfo.in_training) {
			const trainResult = await getTrainingStatus(user);
			console.log('Train result', trainResult);
			if (trainResult.status === 'succeeded') {
				await updateAdminUserInfo(
					user.id,
					{
						replicate_version_id: trainResult.version,
						replicate_train_status: trainResult.status,
						in_training: false,
						trained: true
					},
					supabaseClientAdmin
				);
			}
		}

		return json({ trained: true });
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			console.error(error.cause);
			throw svelteError(500, { message: error.message });
		}
		throw svelteError(500);
	}
};

export const POST: RequestHandler = async (event) => {
	try {
		if (PUBLIC_ENV === 'STAGING') {
			throw new Error("Can't train in staging");
		}

		const {
			theme,
			prompt,
			quantity,
			instance_class: instanceClass
		}: {
			theme: string;
			prompt: string;
			quantity: number;
			instance_class: string | undefined;
		} = await event.request.json();

		if (!instanceClass) {
			throw new Error('Subject not selected');
		}

		const { session } = await getSupabase(event);

		if (!session) {
			throw new Error('Session not valid');
		}
		const user = session.user;

		const userInfo = await getAdminUserInfo(session.user.id, supabaseClientAdmin);

		if (!userInfo.paid) {
			throw new Error('Payment required');
		}
		if (userInfo.in_training || userInfo.trained) {
			throw new Error('Can not train multiple times');
		}

		const imagesCount = handleErrorAndGetData(
			await supabaseClientAdmin.storage.from('photos-for-training').list(userInfo.id)
		).length;

		if (imagesCount < 15) {
			throw new Error(
				'You need to upload at least 15 photos for the AI to learn what you look like'
			);
		}

		const trainResult = await runTrain(instanceClass, user, theme, prompt, quantity);
		console.log('Train result', trainResult);

		await updateAdminUserInfo(
			user.id,
			{
				instance_class: instanceClass,
				in_training: true,
				start_training: new Date().toISOString(),
				replicate_model_id: trainResult.id
			},
			supabaseClientAdmin
		);

		return json({ message: '' });
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			console.error(error.cause);
			throw svelteError(500, { message: error.message });
		}
		throw svelteError(500);
	}
};
