<script>
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "#lib/shared/utils/cn.js";

	let {
		api = $bindable(null),
		ref = $bindable(null),
		value = $bindable(""),
		class: className = undefined,
		...restProps
	} = $props();
</script>

<CommandPrimitive.Root
	bind:this={api}
	bind:value
	bind:ref
	data-slot="command"
	class={cn("bg-popover text-popover-foreground rounded-xl! p-1 flex size-full flex-col overflow-hidden", className)}
	{...restProps}
/>