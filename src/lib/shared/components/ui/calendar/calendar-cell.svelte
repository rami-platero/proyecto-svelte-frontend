<script>
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "#lib/shared/utils/cn.js";

	/** @type {{ ref?: any, class?: any, date: import('@internationalized/date').DateValue, month: import('@internationalized/date').DateValue, [key: string]: any }} */
	let {
		ref = $bindable(null),
		class: className = undefined,
		date,
		month,
		...restProps
	} = $props();
</script>

<CalendarPrimitive.Cell
	bind:ref
	{date}
	{month}
	class={cn(
		"relative size-(--cell-size) p-0 text-center text-sm focus-within:z-20 [&:first-child[data-selected]_[data-bits-day]]:rounded-s-(--cell-radius) [&:last-child[data-selected]_[data-bits-day]]:rounded-e-(--cell-radius)",
		className
	)}
	{...restProps}
/>