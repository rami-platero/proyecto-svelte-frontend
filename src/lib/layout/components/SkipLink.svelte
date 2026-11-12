<script>
	/** @type {{ target?: string, children?: import('svelte').Snippet }} */
	let { target = '#contenido', children } = $props();
</script>

<a
	href={target}
	class="bg-primary text-primary-foreground focus:ring-ring absolute start-4 -top-16 z-50 rounded-md px-4 py-2 text-sm font-semibold transition-[top] focus:top-3 focus:ring-2 focus:ring-offset-2"
>
	{@render children?.()}
</a>
