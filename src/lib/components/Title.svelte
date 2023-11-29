<script lang="ts">
	import cn from 'classnames';

	let classes = '';
	export { classes as class };
</script>

<article class={cn('prose px-2 lg:prose-xl text-center min-w-full', classes)}>
	<h2 on:click><slot /></h2>
</article>
