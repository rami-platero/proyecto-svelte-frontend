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
	data-slot="sidebar-menu"
	data-sidebar="menu"
	class={cn("gap-1 flex w-full min-w-0 flex-col", className)}
	{...restProps}
>
	{@render children?.()}
</ul>