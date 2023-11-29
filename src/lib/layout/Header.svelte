<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<div class="sm:px-4 w-full">
	<div
		class="navbar bg-base-100 drop-shadow-xl sm:rounded-xl mx-auto container max-w-6xl sm:mt-4 w-full"
	>
		<div class="navbar-start">
			<Button ghost link="/" class="text-xl text-gradient font-bold" normalCase>
				<img src="logo.png" alt="PhotosBro" class="w-48" />
				<!-- PhotosBro -->
			</Button>
		</div>
		<div class="navbar-end gap-2">
			{#if $page.data.session}
				<div class="dropdown dropdown-end">
					<div class="tooltip tooltip-left" data-tip={$page.data.session.user.email}>
						<label tabindex="0" class="btn btn-ghost btn-circle">
							<Icon name="person" />
						</label>
					</div>
					<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
						<li>
							<Button link="/logout" ghost data-sveltekit-preload-data="off">Logout</Button>
						</li>
					</ul>
				</div>
				{#if !$page.url.pathname.startsWith('/app')}
					<Button type="button" link="/app" ghost>Launch</Button>
				{/if}
			{:else}
				<Button type="button" link="/login" ghost>Start now</Button>
			{/if}
			<!-- <Button circle icon="search" ghost />
            <Button circle icon="notification_important" ghost /> -->
		</div>
	</div>
</div>
