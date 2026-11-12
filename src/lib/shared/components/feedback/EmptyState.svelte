<script>
	import PackageIcon from '@lucide/svelte/icons/package';

	/**
	 * @type {{
	 *   icon?: import('svelte').Component,
	 *   title: string,
	 *   description?: string,
	 *   children?: import('svelte').Snippet
	 * }}
	 */
	let { icon: Icon = PackageIcon, title, description = '', children } = $props();
</script>

<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
	<span class="bg-muted text-muted-foreground grid size-12 place-items-center rounded-full">
		<Icon class="size-6" />
	</span>
	<h3 class="text-base font-semibold">{title}</h3>
	{#if description}
		<p class="text-muted-foreground max-w-[44ch] text-sm">{description}</p>
	{/if}
	{#if children}
		<div class="mt-2">{@render children()}</div>
	{/if}
</div>
