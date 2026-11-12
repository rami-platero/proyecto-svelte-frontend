<script>
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { cn } from "#lib/shared/utils/cn.js";

	let {
		ref = $bindable(null),
		class: className = undefined,
		value = $bindable(""),
		...restProps
	} = $props();
</script>

<RadioGroupPrimitive.Root
	bind:ref
	bind:value
	data-slot="radio-group"
	class={cn("grid gap-3 w-full", className)}
	{...restProps}
/>