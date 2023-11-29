<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import {
		messages,
		removeMessage,
		resetMessages,
		resetMessageTimeout,
		stopMessageTimeout
	} from '$lib/utilities';
	import Alert from '$lib/components/Alert.svelte';

	beforeNavigate(() => {
		resetMessages();
	});
</script>

{#if $messages.length > 0}
	<div class="toast toast-end">
		{#each $messages.reverse() as message}
			<Alert
				type={message.type}
				on:close={() => removeMessage(message.id)}
				on:mouseenter={() => stopMessageTimeout(message.id)}
				on:mouseleave={() => resetMessageTimeout(message.id)}
			>
				{message.message}
			</Alert>
		{/each}
	</div>
{/if}
