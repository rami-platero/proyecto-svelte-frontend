<script>
	import { Input } from "#lib/shared/components/ui/input/index.js";
	import { cn } from "#lib/shared/utils/cn.js";
	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className = undefined,
		...restProps
	} = $props();
</script>

<Input
	bind:ref
	bind:value
	data-slot="sidebar-input"
	data-sidebar="input"
	class={cn("bg-background h-8 w-full shadow-none", className)}
	{...restProps}
/>