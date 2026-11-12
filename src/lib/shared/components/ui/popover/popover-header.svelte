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
	data-slot="popover-header"
	class={cn("flex flex-col gap-1 text-sm", className)}
	{...restProps}
>
	{@render children?.()}
</div>