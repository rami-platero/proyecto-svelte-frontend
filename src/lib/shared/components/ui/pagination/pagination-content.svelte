<script>
	import { cn } from "#lib/shared/utils/cn.js";
	let {
		ref = $bindable(null),
		class: className = undefined,
		children = undefined,
		...restProps
	} = $props();
</script>

<ul
	bind:this={ref}
	data-slot="pagination-content"
	class={cn("gap-1 flex items-center", className)}
	{...restProps}
>
	{@render children?.()}
</ul>