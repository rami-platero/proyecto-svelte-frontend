<script>
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { buttonVariants } from "#lib/shared/components/ui/button/index.js";
	import { cn } from "#lib/shared/utils/cn.js";
	/** @type {{ ref?: any, class?: any, size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg', isActive?: boolean, page?: any, children?: any, [key: string]: any }} */
	let {
		ref = $bindable(null),
		class: className = undefined,
		size = "icon",
		isActive = undefined,
		page = undefined,
		children = undefined,
		...restProps
	} = $props();
</script>

{#snippet Fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	aria-current={isActive ? "page" : undefined}
	data-slot="pagination-link"
	data-active={isActive}
	data-size={size}
	class={cn(
		buttonVariants({ size, variant: isActive ? "outline" : "ghost" }),
		"",
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children?.()}
	{:else}
		{@render Fallback()}
	{/if}
</PaginationPrimitive.Page>