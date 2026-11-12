<script module>
	import { tv } from "tailwind-variants";

	export const sidebarMenuButtonVariants = tv({
		base: "ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
		variants: {
			variant: {
				default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				outline: "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_var(--sidebar-border)] hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
			},
			size: {
				default: "h-8 text-sm",
				sm: "h-7 text-xs",
				lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

</script>

<script>
	import { mergeProps } from "bits-ui";
	import * as Tooltip from "#lib/shared/components/ui/tooltip/index.js";
	import { cn } from "#lib/shared/utils/cn.js";
	import { useSidebar } from "./context.svelte.js";
	/**
	 * @type {{
	 *   ref?: any,
	 *   class?: any,
	 *   children?: import('svelte').Snippet,
	 *   child?: import('svelte').Snippet<[{ props: Record<string, any> }]>,
	 *   variant?: 'default' | 'outline',
	 *   size?: 'default' | 'sm' | 'lg',
	 *   isActive?: boolean,
	 *   tooltipContent?: any,
	 *   tooltipContentProps?: any,
	 *   [key: string]: any
	 * }}
	 */
	let {
		ref = $bindable(null),
		class: className = undefined,
		children = undefined,
		child = undefined,
		variant = "default",
		size = "default",
		isActive = false,
		tooltipContent = undefined,
		tooltipContentProps = undefined,
		...restProps
	} = $props();

	const sidebar = useSidebar();

	const buttonProps = $derived({
		class: cn(sidebarMenuButtonVariants({ variant, size }), className),
		"data-slot": "sidebar-menu-button",
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive ? true : undefined,
		...restProps,
	});
</script>

{#snippet Button(/** @type {{ props: Record<string, any> }} */ { props })}
	{@const mergedProps = mergeProps(buttonProps, props)}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button bind:this={ref} {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
{/snippet}

{#if !tooltipContent}
	{@render Button({ props: {} })}
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child(/** @type {{ props: Record<string, any> }} */ { props })}
				{@render Button({ props })}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content
			side="right"
			align="center"
			hidden={sidebar.state !== "collapsed" || sidebar.isMobile}
			{...tooltipContentProps}
		>
			{#if typeof tooltipContent === "string"}
				{tooltipContent}
			{:else if tooltipContent}
				{@render tooltipContent()}
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
{/if}