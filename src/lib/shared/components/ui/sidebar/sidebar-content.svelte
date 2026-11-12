<script>
	import { cn } from "#lib/shared/utils/cn.js";
	let {
		ref = $bindable(null),
		class: className = undefined,
		children = undefined,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="sidebar-content"
	data-sidebar="content"
	class={cn(
		"no-scrollbar gap-2 flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>