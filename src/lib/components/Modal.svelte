<div class="modal">
	<div class="modal-box">
		{#if $$slots.title}
			<h3 class="font-bold text-lg">
				<slot name="title" />
			</h3>
		{/if}
		<p class="py-4">
			<slot />
		</p>
		<div class="modal-action">
			<label for="my-modal" class="btn">Yay!</label>
		</div>
	</div>
</div>
