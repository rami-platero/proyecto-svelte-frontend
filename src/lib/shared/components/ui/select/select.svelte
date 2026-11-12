<script>
	import { Select as SelectPrimitive } from "bits-ui";

	/** @type {{ open?: boolean, value?: any, type?: 'single' | 'multiple', [key: string]: any }} */
	let {
		open = $bindable(false),
		value = $bindable(),
		...restProps
	} = $props();

	const rootProps = $derived(/** @type {any} */ (restProps));
</script>

<SelectPrimitive.Root bind:open bind:value={value} {...rootProps} />