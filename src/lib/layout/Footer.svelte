<script>
	import Twitter from '../components/svg/Twitter.svelte';

	import GitHub from '../components/svg/GitHub.svelte';
	import Instagram from '$lib/components/svg/Instagram.svelte';
	import TikTok from '$lib/components/svg/TikTok.svelte';
</script>

<footer class="footer footer-center p-10 bg-neutral text-neutral-content rounded">
	<div class="grid grid-flow-col gap-4">
		<a class="link link-hover" href="/">Home</a>
		<a class="link link-hover" href="/contacts">Contacts</a>
	</div>
	<div>
		<div class="grid grid-flow-col gap-4">
			<a href="https://twitter.com/rishi_kesav_9" target="_blank" rel="noreferrer">
				<Twitter />
			</a>
			<a href="https://www.instagram.com/photosbro_official" target="_blank" rel="noreferrer">
				<Instagram />
			</a>
		</div>
	</div>
	<div>
		<p>Copyright © {new Date().getFullYear()} - All Rights Reserved</p>
	</div>
</footer>
