<script>
	import { page } from '$app/state';
	import { Separator } from '#lib/shared/components/ui/separator/index.js';
	import { SidebarTrigger } from '#lib/shared/components/ui/sidebar/index.js';
	import { NAV_LINKS } from '#lib/layout/navigation.js';
	import ThemeToggle from './ThemeToggle.svelte';

	const current = $derived(
		NAV_LINKS.find((link) =>
			link.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(link.href)
		)
	);
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur"
>
	<SidebarTrigger class="-ms-1" />
	<Separator orientation="vertical" class="me-1 h-5" />
	<p class="text-sm font-medium">{current?.label ?? 'Panel'}</p>
	<div class="ms-auto">
		<ThemeToggle />
	</div>
</header>
