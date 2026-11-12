<script>
	import './layout.css';

	import { ModeWatcher } from 'mode-watcher';
	import favicon from '#lib/assets/favicon.svg';
	import AppSidebar from '#lib/layout/components/AppSidebar.svelte';
	import AppTopbar from '#lib/layout/components/AppTopbar.svelte';
	import SkipLink from '#lib/layout/components/SkipLink.svelte';
	import { loadShell, startRealtime } from '#lib/layout/state/bootstrap.svelte.js';
	import { SidebarInset, SidebarProvider } from '#lib/shared/components/ui/sidebar/index.js';
	import { Toaster } from '#lib/shared/components/ui/sonner/index.js';

	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();

	$effect(() => {
		void loadShell();
	});

	$effect(() => startRealtime());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster position="bottom-right" richColors closeButton />

<SkipLink>Saltar al contenido principal</SkipLink>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<AppTopbar />
		<main id="contenido" tabindex="-1" class="w-full min-w-0 p-4 outline-none md:p-6">
			{@render children()}
		</main>
	</SidebarInset>
</SidebarProvider>
