<script>
	import { cn } from "#lib/shared/utils/cn.js";
	let {
		ref = $bindable(null),
		class: className = undefined,
		children = undefined,
		...restProps
	} = $props();
</script>

<nav
	{...restProps}
	bind:this={ref}
	class={cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", className)}
>
	{@render children?.()}
</nav>