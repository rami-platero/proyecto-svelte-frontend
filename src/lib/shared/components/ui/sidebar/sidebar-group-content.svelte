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
	data-slot="sidebar-group-content"
	data-sidebar="group-content"
	class={cn("text-sm w-full", className)}
	{...restProps}
>
	{@render children?.()}
</div>