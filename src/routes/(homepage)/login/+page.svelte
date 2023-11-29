<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_WEBSITE_HOST } from '$env/static/public';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Google from '$lib/components/svg/Google.svelte';
	import Title from '$lib/components/Title.svelte';
	import { handleError, supabaseClient } from '$lib/db';
	import { getBaseUrl, showError, showInfo } from '$lib/utilities';

	let email = '';
	let loadingSubmit = false;
	let loadingGoogle = false;

	async function login() {
		loadingSubmit = true;
		try {
			if (!email.trim()) {
				throw new Error('Enter an email');
			}
			handleError(
				await supabaseClient.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: getBaseUrl() + '/app'
					}
				})
			);
			showInfo('Please access the link we just sent you via email.');
		} catch (error) {
			if (error) {
				showError(error);
			}
		} finally {
			loadingSubmit = false;
		}
	}

	async function loginWithGoogle() {
		loadingGoogle = true;
		try {
			handleError(
				await supabaseClient.auth.signInWithOAuth({
					provider: 'google',
					options: {
						redirectTo: `${PUBLIC_WEBSITE_HOST}/app`
					}
				})
			);

			goto('/app');
		} catch (error) {
			showError(error);
		} finally {
			loadingGoogle = false;
		}
	}
</script>

<div class="w-full max-w-sm mx-auto my-16 px-2">
	<div class="w-full bg-black shadow rounded-lg divide-y divide-gray-200" style="background-color: #191b1c;">
		<form class="px-5 py-7 flex flex-col gap-4" on:submit|preventDefault={login}>
			<Title>Sign in</Title>
			<p class="italic text-center">
				Sign in now to create personalized avatars that represents you.
			</p>
			<Button
				type="button"
				normalCase
				on:click={loginWithGoogle}
				block
				loading={loadingGoogle}
				disabled={loadingGoogle}
				animated
			>
				<Google />
				Sign in with Google
			</Button>
		</form>
		<div class="py-5">
			<div class="flex flex-row justify-between px-4">
				<Button startIcon="arrow_back" ghost size="tiny" link="/" normalCase
					>Back to photosbro.com</Button
				>
				<Button startIcon="contact_support" ghost size="tiny" link="/contacts" normalCase
					>Help</Button
				>
			</div>
		</div>
	</div>
</div>
