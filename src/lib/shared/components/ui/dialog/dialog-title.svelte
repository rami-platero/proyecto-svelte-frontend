<script>
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "#lib/shared/utils/cn.js";

	let {
		ref = $bindable(null),
		class: className = undefined,
		...restProps
	} = $props();
</script>

<DialogPrimitive.Title
	bind:ref
	data-slot="dialog-title"
	class={cn("leading-none font-medium", className)}
	{...restProps}
/>