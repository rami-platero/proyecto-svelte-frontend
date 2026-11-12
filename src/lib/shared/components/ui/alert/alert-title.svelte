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
	data-slot="alert-title"
	class={cn(
		"font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>