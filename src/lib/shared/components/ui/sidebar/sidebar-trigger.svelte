<script>
	import PanelLeftIcon from '@lucide/svelte/icons/panel-left';
	import { Button } from "#lib/shared/components/ui/button/index.js";
	import { cn } from "#lib/shared/utils/cn.js";
	import { useSidebar } from "./context.svelte.js";
	let {
		ref = $bindable(null),
		class: className = undefined,
		onclick = undefined,
		...restProps
	} = $props();

	const sidebar = useSidebar();
</script>

<Button
	bind:ref
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	variant="ghost"
	size="icon-sm"
	class={cn(className)}
	type="button"
	onclick={(/** @type {MouseEvent} */ e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	{...restProps}
>
	<PanelLeftIcon class="cn-rtl-flip" />
	<span class="sr-only">Toggle Sidebar</span>
</Button>