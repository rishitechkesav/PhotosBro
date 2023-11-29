<script lang="ts">
	import { goto } from '$app/navigation';
	import Alert from '$lib/components/Alert.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { supabaseClient } from '$lib/db';
	import type { AuthError } from '@supabase/supabase-js';
	let email = '';
	let password = '';

	let error: AuthError | null;
	async function signup() {
		({ error } = await supabaseClient.auth.signUp({
			email,
			password
		}));
		if (!error) {
			goto('/');
		}
	}
</script>

<h1 class="font-bold text-center text-2xl mb-5">PhotosBro</h1>
<div class="bg-black shadow w-full rounded-lg divide-y divide-gray-200">
	<form class="px-5 py-7 flex flex-col gap-4" on:submit={signup}>
		<Input bind:value={email} id="email" label="E-mail" />
		<Input bind:value={password} type="password" id="password" label="Password" />
		{#if error}
			<Alert type="error" on:close={() => (error = null)}>{error.message}</Alert>
		{/if}
		<Button endIcon="arrow_forward" block type="submit" on:click={() => signup()}>Signup</Button>
	</form>
	<div class="p-5">
		<div class="grid grid-cols-3 gap-1">
			<Button outline size="small" type="button">Google</Button>
			<Button outline size="small" type="button">Facebook</Button>
			<Button outline size="small" type="button">Twitter</Button>
		</div>
	</div>
	<div class="py-5">
		<div class="text-center sm:text-left blackspace-nowrap px-4">
			<Button startIcon="login" ghost size="tiny" link="/login">Already registered?</Button>
			<Button startIcon="contact_support" class="float-right" ghost size="tiny">Help</Button>
		</div>
	</div>
</div>
<div class="py-5">
	<div class="text-center sm:text-left blackspace-nowrap">
		<button class="btn btn-ghost btn-sm gap-2 text-xs" type="button">
			<span class="material-symbols-outlined text-sm"> arrow_back </span>
			Back to photosbro.com
		</button>
	</div>
</div>
