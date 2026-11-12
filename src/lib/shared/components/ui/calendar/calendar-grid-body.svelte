<script>
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "#lib/shared/utils/cn.js";

	let {
		ref = $bindable(null),
		class: className = undefined,
		...restProps
	} = $props();
</script>

<CalendarPrimitive.GridBody bind:ref class={cn(className)} {...restProps} />