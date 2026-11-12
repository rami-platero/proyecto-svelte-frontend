<script>
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { buttonVariants } from "#lib/shared/components/ui/button/index.js";
	import { cn } from "#lib/shared/utils/cn.js";

	/** @type {{ ref?: any, class?: any, variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link', size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg', [key: string]: any }} */
	let {
		ref = $bindable(null),
		class: className = undefined,
		variant = "outline",
		size = "default",
		...restProps
	} = $props();
</script>

<AlertDialogPrimitive.Cancel
	bind:ref
	data-slot="alert-dialog-cancel"
	class={cn(buttonVariants({ variant, size }), "", className)}
	{...restProps}
/>