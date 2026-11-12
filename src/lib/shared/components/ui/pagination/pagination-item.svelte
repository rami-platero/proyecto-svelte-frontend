<script>
	let {
		ref = $bindable(null),
		children = undefined,
		...restProps
	} = $props();
</script>

<li bind:this={ref} data-slot="pagination-item" {...restProps}>
	{@render children?.()}
</li>