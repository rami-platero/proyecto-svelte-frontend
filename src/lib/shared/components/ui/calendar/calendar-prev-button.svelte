<script>
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { buttonVariants } from "#lib/shared/components/ui/button/index.js";
	import { cn } from "#lib/shared/utils/cn.js";

	/** @type {{ ref?: any, class?: any, children?: any, variant?: 'link' | 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive', [key: string]: any }} */
	let {
		ref = $bindable(null),
		class: className = undefined,
		children = undefined,
		variant = "ghost",
		...restProps
	} = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class={cn("cn-rtl-flip size-4", className)} />
{/snippet}

<CalendarPrimitive.PrevButton
	bind:ref
	class={cn(
		buttonVariants({ variant }),
		"size-(--cell-size) bg-transparent p-0 select-none disabled:opacity-50",
		"rtl:rotate-180",
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		{@render Fallback()}
	{/if}
</CalendarPrimitive.PrevButton>