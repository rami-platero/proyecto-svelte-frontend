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
	data-slot="card-footer"
	class={cn("rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing) flex items-center", className)}
	{...restProps}
>
	{@render children?.()}
</div>