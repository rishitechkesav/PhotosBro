<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Compressor from 'compressorjs';

	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Title from '$lib/components/Title.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { supabaseClient, handleErrorAndGetData, getUserInfo } from '$lib/db';
	import type { Database } from '$lib/supabase-types';
	import { getThemes } from '$lib/themes';
	import { showError } from '$lib/utilities';
	import { onMount } from 'svelte';
	import watermark from 'watermarkjs';
	import { i18n } from '$lib/i18n';
	import { clickoutside } from '@svelte-put/clickoutside';


	let userInfo: Database['public']['Tables']['user_info']['Row'] | null = null;

	let themeOpen = false;

	async function updateUserInfo() {
		userInfo = await getUserInfo();
		if (typeof spoilerOpen == 'undefined') {
			spoilerOpen = !userInfo.in_training && !userInfo.trained;
		}
		if (userInfo.instance_class) {
			instanceClass = userInfo.instance_class;
		}
	}
	updateUserInfo();

	$: {
		if (spoilerOpen && typeof photosForTrain === 'undefined') {
			loadPhotosForTraining();
		}
	}

	let uploadLoading = false;
	let inputFiles: HTMLInputElement;

	let trainingPhotosLoading = false;
	let generatedPhotosLoading = false;
	let generating = false;
	let photosForTrain: { url: string; name: string }[] | undefined = undefined;
	type GeneratedPhoto = { name: string } & (
		| { url: string; thumb: string; complete: true }
		| { complete: false }
	);
	let photosGenerated: GeneratedPhoto[] = [];

	let instanceClass = '';
	let theme = '';
	let prompt = '';
	let seed = '';
	let quantity = 50;
	let spoilerOpen: boolean | undefined = undefined;

	async function onUploadSubmit() {
		uploadLoading = true;
		try {
			if (inputFiles.files) {
				if ((photosForTrain?.length || 0) + inputFiles.files?.length > 30) {
					throw new Error('You can upload a maximum of 20 photos');
				}
				const requests = [];
				for (let i = 0; i < inputFiles.files.length; i++) {
					requests.push(
						new Promise((resolve, reject) => {
							if (inputFiles.files) {
								new Compressor(inputFiles.files[i], {
									width: 512,
									height: 512,
									resize: 'cover',
									quality: 1,
									strict: false,
									error(error) {
										showError(error);
										reject();
									},
									async success(file) {
										supabaseClient.storage
											.from('photos-for-training')
											.upload(
												$page.data.session?.user.id + '/' + file.name,
												await file.arrayBuffer()
											)
											.then((result) => {
												if (result.error) {
													showError(result.error);
													reject();
												}
												resolve(result);
											});
									}
								});
							}
						})
					);
				}
				await Promise.allSettled(requests);
				inputFiles.value = '';
			}
		} catch (error) {
			showError(error);
		} finally {
			uploadLoading = false;
			loadPhotosForTraining();
		}
	}

	async function train() {
		if (!userInfo) return;
		try {
			userInfo.in_training = true;
			const response = await fetch('/api/train', {
				method: 'POST',
				body: JSON.stringify({
					instance_class: instanceClass,
					theme,
					prompt,
					quantity
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
			if (!response.ok) {
				throw (await response.json()).message;
			}
		} catch (error) {
			userInfo.in_training = false;
			showError(error);
		}
	}
	async function prediction() {
		if (theme && prompt) {
			showError('Theme not selected');
		} else if (userInfo.counter < 110){
			try {
				generating = true;
				const response = await fetch('/api/prediction', {
					body: JSON.stringify({ theme, prompt, seed, quantity }),
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					}
				});
				if (!response.ok) {
					throw (await response.json()).message;
				}
				updateUserInfo();
			} catch (error) {
				showError(error);
			} finally {
				generating = false;
			}
		}
	}

	async function getSignedUrl(bucket: string, filename: string, thumbnail = true) {
		return handleErrorAndGetData(
			await supabaseClient.storage.from(bucket).createSignedUrl(
				$page.data.session?.user.id + '/' + filename,
				86400,
				thumbnail
					? {
							transform: {
								height: 96,
								width: 96,
								resize: 'cover'
							}
					  }
					: {}
			)
		)?.signedUrl;
	}

	async function loadPhotosForTraining() {
		trainingPhotosLoading = true;
		try {
			photosForTrain = await Promise.all(
				handleErrorAndGetData(
					await supabaseClient.storage
						.from('photos-for-training')
						.list($page.data.session?.user.id, {
							sortBy: {
								column: 'created_at',
								order: 'asc'
							}
						})
				).map(async (file) => ({
					url: await getSignedUrl('photos-for-training', file.name),
					name: file.name
				}))
			);
		} catch (error) {
			showError(error);
		} finally {
			trainingPhotosLoading = false;
		}
	}

	async function deletePhotoForTraining(index: number) {
		const photoToDelete = photosForTrain?.[index];
		if (photoToDelete) {
			photosForTrain = photosForTrain?.filter((photo) => photo !== photoToDelete);
			try {
				await supabaseClient.storage
					.from('photos-for-training')
					.remove([getPhotoPath(photoToDelete.name)]);
			} catch (error) {
				showError(error);
			}
		}
	}

	function getPhotoPath(name: string) {
		return `${$page.data.session?.user.id}/${name}`;
	}

	async function deletePhotoGenerated(index: number) {
		const photoToDelete = photosGenerated[index];
		photosGenerated = photosGenerated.filter((photo) => photo !== photoToDelete);
		if (photoToDelete.complete) {
			try {
				await supabaseClient.storage
					.from('photos-generated')
					.remove([getPhotoPath(photoToDelete.name)]);
			} catch (error) {
				showError(error);
			}
		}
	}
	const options = {
		init(img: HTMLImageElement) {
			img.crossOrigin = 'anonymous';
		}
	};

	async function downloadPhoto(photo: GeneratedPhoto) {
    if (photo.complete) {
        const response = await fetch(photo.url);
        const blob = await response.blob();

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = photo.name.replace('.jpg', '.png');
        a.click();

        URL.revokeObjectURL(a.href); // Clean up the object URL
    }
}



	async function loadPhotoGenerated() {
		generatedPhotosLoading = true;
		try {
			photosGenerated = handleErrorAndGetData(
				await supabaseClient.storage.from('photos-generated').list($page.data.session?.user.id, {
					sortBy: {
						column: 'created_at',
						order: 'asc'
					}
				})
			).map((photo) => ({
				complete: true,
				name: photo.name,
				url: supabaseClient.storage.from('photos-generated').getPublicUrl(getPhotoPath(photo.name))
					.data.publicUrl,
				thumb: supabaseClient.storage
					.from('photos-generated')
					.getPublicUrl(getPhotoPath(photo.name), {
						transform: {
							height: 96,
							width: 96
						}
					}).data.publicUrl
			}));

			photosGenerated = [
				...photosGenerated,
				...(((
					await supabaseClient
						.from('predictions')
						.select('*')
						.eq('user_id', $page.data.session?.user.id)
						.in('status', ['starting', 'processing'])
				).data?.map((image) => ({
					complete: false,
					name: `${image.id}.jpg`
				})) || []) as { complete: false; name: string }[])
			];
		} catch (error) {
			showError(error);
		} finally {
			generatedPhotosLoading = false;
		}
	}

	onMount(async () => {
		if (browser) {
			loadPhotoGenerated();

			// Subscribe for new generated photos and update the list
			const subscriptionPhotosChange = supabaseClient
				.channel('public:predictions')
				.on<Database['public']['Tables']['predictions']['Row']>(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'predictions' },
					async (payload) => {
						console.log('Prediction changes', payload);
						if (payload.eventType == 'UPDATE') {
							if (payload.old.status !== payload.new.status && payload.new.status === 'succeeded') {
								photosGenerated = photosGenerated.map((photo): GeneratedPhoto => {
									if (photo.name === `${payload.new.id}.jpg`) {
										return {
											...photo,
											complete: true,
											url: supabaseClient.storage
												.from('photos-generated')
												.getPublicUrl(getPhotoPath(photo.name)).data.publicUrl,
											thumb: supabaseClient.storage
												.from('photos-generated')
												.getPublicUrl(getPhotoPath(photo.name), {
													transform: {
														height: 96,
														width: 96
													}
												}).data.publicUrl
										};
									} else {
										return photo;
									}
								});
							}
						} else if (payload.eventType == 'INSERT' && payload.new.status !== 'succeeded') {
							photosGenerated = [
								...photosGenerated,
								{
									complete: false,
									name: `${payload.new.id}.jpg`
								}
							];
						}
					}
				)
				.subscribe();

			const subscriptionInfoChange = supabaseClient
				.channel('public:user_info')
				.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_info' }, () => {
					updateUserInfo();
				});

			return () => {
				subscriptionPhotosChange.unsubscribe();
				subscriptionInfoChange.unsubscribe();
			};
		}
	});
</script>


<style>
.form-control {
		z-index: 10;
  }
</style>


<div class="w-full color-white max-w-2xl mx-auto my-16 px-2 gap-4 flex flex-col items-center">
	{#if userInfo}
		<ul class="steps text-xs sm:text-base">
			<li
				class="step"
				class:step-primary={(photosForTrain && photosForTrain.length > 0) ||
					userInfo.in_training ||
					userInfo.trained}
			>
				{$i18n.t('uploadYourPhotos')}
			</li>
			<li class="step" class:step-primary={!!userInfo.paid}>
				{$i18n.t('payment')}
			</li>
			<li class="step" class:step-primary={!!userInfo.paid && photosGenerated.length > 0}>
				Generate your avatars
			</li>
		</ul>

		<div
			tabindex="0"
			role="button"
			class:collapse-open={spoilerOpen}
			class:collapse-close={!spoilerOpen}
			class="collapse collapse-arrow w-full bg-black shadow rounded-lg p-6 flex flex-col items-center gap-4"
			style="background-color: #191b1c;"
		>
			{#if !userInfo.trained && !userInfo.in_training}
				<Title
					class="collapse-title"
					on:click={() => {
						spoilerOpen = !spoilerOpen;
					}}>Upload your photos</Title
				>
			{:else}
				<Title
					class="collapse-title"
					on:click={() => {
						spoilerOpen = !spoilerOpen;
					}}>Photos for training</Title
				>
			{/if}
			<div class="collapse-content flex flex-col items-center gap-4 overflow-hidden">
				{#if !userInfo.trained && !userInfo.in_training}
<img class="h-40 rounded-lg object-cover" src="1.jpeg" alt="Style Avatar">
<img class="h-40 rounded-lg object-cover" src="2.jpeg" alt="Style Avatar">




					<form
						on:submit|preventDefault={onUploadSubmit}
						class="w-full flex flex-col items-center gap-4"
					>
						<Input bind:input={inputFiles} accept="image/*" type="file" name="photos" multiple />
						

						<p class="italic text-xs max-w-xs">
							It is necessary to upload at least 15 photos (ideally at least a dozen) where your face
							is clearly visible from multiple angles.
						</p>
						<p class="italic text-xs text-red-700 max-w-xs">
							Do not upload the same photo multiple times, as the AI needs to have different photos
							to learn from.
						</p>
						<Button
							size="medium"
							type="submit"
							disabled={userInfo.in_training}
							loading={uploadLoading}
							animated>Upload</Button
						>
					</form>
				{/if}
				{#if trainingPhotosLoading}
					<progress class="progress" />
				{:else if photosForTrain && photosForTrain.length > 0}
					<div class="flex flex-col items-center">
						<div
							class="flex flex-row justify-center bg-neutral gap-2 p-2 flex-wrap max-h-[40vh] overflow-y-auto overflow-x-hidden rounded-md"
						>
							{#each photosForTrain as image, index}
								<div class="relative group">
									<img
										src={image.url}
										loading="eager"
										alt={image.name}
										class="aspect-square h-24"
									/>

									{#if !userInfo.in_training && !userInfo.trained}
										<Button
											class="absolute -right-2 -top-2 text-white opacity-0 group-hover:opacity-100 z-10"
											icon="close"
											size="small"
											circle
											primary
											on:click={() => deletePhotoForTraining(index)}
										/>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<div
			class="w-full bg-black shadow rounded-lg p-6 flex flex-col items-center gap-4"
			style="background-color: #191b1c;"
		>
			<Title class="mb-4">Pay with Stripe</Title>
			<div class="flex flex-row justify-center w-full">
				{#if userInfo.paid == null}
					<progress class="progress" />
				{:else if userInfo.paid}
					<Button size="small" disabled>Paid</Button>
				{:else}
					<Button size="medium" link="/checkout" animated>Pay now</Button>
				{/if}
			</div>
		</div>

		<div
			class="w-full bg-black shadow rounded-lg p-6 flex flex-col items-center gap-4 overflow-hidden"
			style="background-color: #191b1c;"
		>
			<Title>Generate your avatars ({userInfo.counter})</Title>
			<div class="flex flex-row justify-center gap-4 flex-wrap w-full">
				{#if generatedPhotosLoading}
					<progress class="progress" />
				{:else if photosGenerated.length > 0}
					<div class="carousel carousel-center w-full p-8 space-x-4 bg-neutral rounded-box">
						{#each photosGenerated as image, index}
							<div class="carousel-item relative group aspect-square" id={`photo_${index}`}>
								{#if image.complete}
									<img
										src={image.url}
										loading="eager"
										alt=""
										class="aspect-square rounded-box max-w-[60vw]"
									/>
									

									<Button
										class="absolute right-3 top-3 text-white opacity-0 group-hover:opacity-100"
										icon="close"
										size="small"
										circle
										primary
										on:click={() => deletePhotoGenerated(index)}
									/>

									<Button
										class="absolute right-3 bottom-3 text-white opacity-0 group-hover:opacity-100"
										icon="download"
										size="small"
										circle
										primary
										on:click={() => downloadPhoto(image)}
										target="_blank"
									/>
								{:else}
									<div
										class="aspect-square max-w-[60vw] bg-slate-300 flex items-center justify-center p-8 rounded-md"
									>
										<progress class="progress w-56" />
									</div>
								{/if}
							</div>
						{/each}
					</div>
					<div class="flex flex-col items-center">
						<div
							class="flex flex-row justify-center bg-neutral gap-2 p-2 flex-wrap max-h-[40vh] overflow-y-auto overflow-x-hidden rounded-md"
						>
							{#each photosGenerated as image, index}
								<div class="relative group">
									<a href={`#photo_${index}`}>
										{#if image.complete}
											<img src={image.url} loading="eager" class="aspect-square h-24" />
										{:else}
											<div
												class="aspect-square h-24 bg-slate-300 flex items-center justify-center p-4 rounded-sm"
											>
												<progress class="progress" />
											</div>
										{/if}
									</a>
									{#if image.complete}
										<Button
											class="absolute -right-2 -top-2 text-white opacity-0 group-hover:opacity-100 z-10"
											icon="close"
											size="small"
											circle
											primary
											on:click={() => deletePhotoGenerated(index)}
										/>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<p class="italic text-xs">There are not yet any images present.</p>
				{/if}
			</div>

			{#if !userInfo.trained && !userInfo.in_training}
				<div class="form-control w-full max-w-xs">
					<label class="label" for="instance_class">
						<span class="label-text">Specify the subject</span>
					</label>
					<select class="select select-bordered" id="instance_class" bind:value={instanceClass}>
						<option disabled selected />
						<option value="young man">Young Male</option>
						<option value="man">Male</option>
						<option value="young woman">Young Female</option>
						<option value="woman">Female</option>
					</select>
				</div>
			{/if}

<!-- Move to component 

{#if !userInfo.trained && !userInfo.in_training}
<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text text-inherit">Choose the style</span>
  </label>
  <div
    class="relative w-full"
    class:popup-open={themeOpen}
    use:clickoutside
    on:clickoutside={() => (themeOpen = false)}
  >
    <input
      bind:value={theme}
      class="w-full input input-bordered"
      readonly
      on:focus={() => {
        themeOpen = true;
      }}
    />
    {#if themeOpen}
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
        <div class="bg-gray-900 p-4 rounded-lg shadow-lg w-96 max-h-80 overflow-y-auto grid gap-4 grid-cols-2">
          {#each getThemes(instanceClass) as { name }}
            <div
              class="relative cursor-pointer text-center"
              style="background-color: black;"
              on:click={() => {
                theme = name;
                themeOpen = false;
              }}
            >
              <img
                class="h-40 w-full rounded-lg object-cover"
                src={`AIStyles/${name}.png`}
                alt="Style Avatar"
              />
              <div class="p-2 bg-black bg-opacity-50 rounded-lg">
                <p class="text-white font-semibold">{name}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
{/if}

-->

			<div class="divider -mb-2"></div>

			{#if !userInfo.trained && userInfo.counter > 50}
				<Button
					size="small"
					type="button"
					on:click={() => prediction()}
					disabled={!userInfo.paid || !userInfo.trained || generating || userInfo.in_training}
					animated>Generate</Button
				>
			{:else}
				<Tooltip
					message={!userInfo.paid
						? 'Before being able to train the AI, you must first complete the payment.'
						: 'Caution: If you continue, you will not be able to upload any more photos.'}
				>
					<Button
						size="small"
						type="button"
						on:click={() => train()}
						disabled={!userInfo.paid ||
							(photosForTrain && photosForTrain.length == 0) ||
							userInfo.trained ||
							userInfo.in_training}
						animated
					>
						{#if userInfo.in_training}
							Generating..
						{:else if userInfo.trained}
							Generated
						{:else}
							Generate
						{/if}
					</Button>
					{#if userInfo.in_training}
						<p class="italic text-xs mt-2">It can take up to 2 hours to complete the AI training</p>
					{/if}
				</Tooltip>
			{/if}
		</div>
	{/if}
</div>

