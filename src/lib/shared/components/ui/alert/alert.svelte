<script module>
	import { tv } from "tailwind-variants";

	export const alertVariants = tv({
		base: "grid gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 group/alert relative w-full",
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});
</script>

<script>
	import { cn } from "#lib/shared/utils/cn.js";
	/** @type {{ ref?: any, class?: any, variant?: 'default' | 'destructive', children?: any, [key: string]: any }} */
	let {
		ref = $bindable(null),
		class: className = undefined,
		variant = "default",
		children = undefined,
		...restProps
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert"
	role="alert"
	class={cn(alertVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>