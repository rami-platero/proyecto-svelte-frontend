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
	data-slot="sheet-header"
	class={cn("gap-1.5 p-4 flex flex-col", className)}
	{...restProps}
>
	{@render children?.()}
</div>