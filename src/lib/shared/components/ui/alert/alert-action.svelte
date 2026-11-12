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
	data-slot="alert-action"
	class={cn("absolute top-2.5 right-3", className)}
	{...restProps}
>
	{@render children?.()}
</div>