<script lang="ts">
	import '../../app.css';
	import { supabaseClient } from '$lib/db';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import Hero from '$lib/layout/Hero.svelte';
	import MessagesQueue from '$lib/components/MessagesQueue.svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<div class="min-h-screen flex flex-col">
	<div class="w-full flex-1">
		<Header />

		<div class="h-full w-full flex flex-col justify-center sm:pt-4 pb-4">
			<Hero />
			<slot />
			<MessagesQueue />
		</div>
	</div>
	<Footer />
</div>
