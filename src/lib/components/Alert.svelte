<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let type: 'error' | 'info' = 'info';
	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<div
	class="alert shadow-lg"
	class:alert-error={type == 'error'}
	transition:fade
	on:mouseenter
	on:mouseleave
>
	<div>
		{#if type == 'error'}
			<span class="material-symbols-outlined text-lg"> error </span>
		{:else if type == 'info'}
			<span class="material-symbols-outlined text-lg"> info </span>
		{/if}
		<div>
			{#if $$slots.title}
				<h3 class="font-bold">
					<slot name="title" />
				</h3>
			{/if}
			<div class="text-sm"><slot /></div>
		</div>
		<button class="btn btn-ghost btn-xs gap-1" type="button" on:click={() => dispatch('close')}>
			<span class="material-symbols-outlined text-sm"> close </span>
		</button>
	</div>
</div>
