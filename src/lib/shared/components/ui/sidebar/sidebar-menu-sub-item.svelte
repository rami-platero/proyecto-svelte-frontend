<script>
	import { cn } from "#lib/shared/utils/cn.js";
	let {
		ref = $bindable(null),
		children = undefined,
		class: className = undefined,
		...restProps
	} = $props();
</script>

<li
	bind:this={ref}
	data-slot="sidebar-menu-sub-item"
	data-sidebar="menu-sub-item"
	class={cn("group/menu-sub-item relative", className)}
	{...restProps}
>
	{@render children?.()}
</li>