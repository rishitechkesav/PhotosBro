import {
	PRIVATE_REPLICATE_API_TOKEN,
	PRIVATE_REPLICATE_INSTANCE_TOKEN,
	PRIVATE_REPLICATE_MAX_TRAIN_STEPS,
	PRIVATE_REPLICATE_USERNAME
} from '$env/static/private';
import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
import type { User } from '@supabase/supabase-js';

async function getClient<T extends object>({
	path,
	method = 'GET',
	body,
	experimental = false
}: {
	path: string;
	body?: object;
	method?: string;
	experimental?: boolean;
}) {
	const response = await fetch(
		`${
			experimental
				? 'https://dreambooth-api-experimental.replicate.com'
				: 'https://api.replicate.com'
		}${path}`,
		{
			...(body ? { body: JSON.stringify(body) } : {}),
			method,
			headers: {
				Authorization: `Token ${PRIVATE_REPLICATE_API_TOKEN}`,
				'Content-Type': 'application/json'
			}
		}
	);
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return (await response.json()) as T;
}

export const getRefinedInstanceClass = (instanceClass: string) => {
	return instanceClass === 'man' ? 'male' : instanceClass === 'youngmale' ? 'youngmale' : instanceClass === 'youngfemale' ? 'youngfemale' : instanceClass === 'woman' ? 'female' : instanceClass;
};

export const replacePromptToken = (prompt: string, instanceClass: string) => {
	const refinedPrompt = prompt.replaceAll(
		'@me',
		`${PRIVATE_REPLICATE_INSTANCE_TOKEN} ${getRefinedInstanceClass(instanceClass)}`
	);

	return refinedPrompt;
};

export interface ReplicateTrainPayload {
	id: string;
	input: {
		instance_prompt: string;
		class_prompt: string;
		instance_data: string;
		max_train_steps: number;
	};
	logs: string;
	model: string;
	status: string;
	trainer_version: string;
	webhook_completed: string;
	version: string;
}

export async function getTrainingStatus(user: User) {
	return await getClient<ReplicateTrainPayload>({
		path: `/v1/trainings/${user.id}`,
		experimental: true
	});
}

export async function runTrain(
	instanceClass: string,
	user: User,
	theme: string,
	prompt: string,
	quantity: number
) {
	return await getClient<ReplicateTrainPayload>({
		path: '/v1/trainings',
		body: {
			input: {
				instance_prompt: `a photo of a ${PRIVATE_REPLICATE_INSTANCE_TOKEN} ${instanceClass}`,
				class_prompt: `a photo of a ${instanceClass}`,
				instance_data: `${PUBLIC_WEBSITE_HOST}/api/webhooks/${user.id}/instance_data`,
				max_train_steps: Number(PRIVATE_REPLICATE_MAX_TRAIN_STEPS) || 2000,
				num_class_images: 200,
				learning_rate: 1e-6
			},
			model: `${PRIVATE_REPLICATE_USERNAME}/${user.id}`,
			webhook_completed: `${PUBLIC_WEBSITE_HOST}/api/webhooks/${
				user.id
			}/training_complete?theme=${encodeURIComponent(theme)}&prompt=${encodeURIComponent(
				prompt
			)}&quantity=${encodeURIComponent(quantity)}`
		},
		method: 'POST',
		experimental: true
	});
}

export interface ReplicatePredictionPayload {
	id: string;
	version: string;
	urls: {
		get: string;
		cancel: string;
	};
	created_at?: string;
	started_at?: string;
	completed_at?: string;
	status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'failed';
	input: {
		text: string;
	};
	output?: string[];
	error?: string;
	logs?: string;
	metrics: object;
}

export async function getPredictionStatus(predictID: string) {
	return await getClient<ReplicatePredictionPayload>({
		path: `/v1/predictions/${predictID}`
	});
}

export async function runPrediction(
	version: string,
	prompt: string,
	negativePrompt: string,
	seed: string | undefined,
	userID: string
) {
	return await getClient<ReplicatePredictionPayload>({
		path: '/v1/predictions',
		body: {
			input: {
				prompt,
				negative_prompt: negativePrompt,
				...(seed && !isNaN(parseInt(seed)) ? { seed: parseInt(seed) } : {}),
				disable_safety_check: true
				
			},
			webhook_completed: `${PUBLIC_WEBSITE_HOST}/api/webhooks/${userID}/prediction_complete`,
			version
		},
		method: 'POST'
	});
}

