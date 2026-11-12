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
	data-slot="card-content"
	class={cn("flex flex-col gap-3 px-(--card-spacing)", className)}
	{...restProps}
>
	{@render children?.()}
</div>