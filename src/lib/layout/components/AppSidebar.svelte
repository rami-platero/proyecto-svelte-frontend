<script>
	import { page } from '$app/state';
	import ArrowDownUpIcon from '@lucide/svelte/icons/arrow-down-up';
	import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import PackageIcon from '@lucide/svelte/icons/package';
	import TagsIcon from '@lucide/svelte/icons/tags';
	import {
		Sidebar,
		SidebarContent,
		SidebarGroup,
		SidebarGroupContent,
		SidebarGroupLabel,
		SidebarHeader,
		SidebarMenu,
		SidebarMenuBadge,
		SidebarMenuButton,
		SidebarMenuItem
	} from '#lib/shared/components/ui/sidebar/index.js';
	import { APP_NAME, APP_TAGLINE } from '#lib/shared/config/app.js';
	import { NAV_LINKS } from '#lib/layout/navigation.js';
	import { summary } from '#lib/features/dashboard/state/summary.svelte.js';

	/** @type {Record<string, import('svelte').Component>} */
	const icons = {
		'/': LayoutDashboardIcon,
		'/productos': PackageIcon,
		'/movimientos': ArrowDownUpIcon,
		'/vencimientos': CalendarClockIcon,
		'/categorias': TagsIcon
	};

	// Los contadores salen de la vista inventory_summary: los cuenta la base,
	// no hace falta traer todos los productos ni todos los lotes para esto.
	/** @type {Record<string, { total: number, urgent: boolean }>} */
	const counts = $derived({
		'/productos': {
			total: summary.data.restockCount,
			urgent: summary.data.outOfStockCount > 0
		},
		'/vencimientos': {
			total: summary.data.expiringCount,
			urgent: summary.data.expiredCount > 0
		}
	});

	/** @param {string} href */
	function isCurrent(href) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<Sidebar collapsible="icon">
	<SidebarHeader>
		<a href="/" class="flex items-center gap-2.5 rounded-md p-1">
			<span
				class="bg-sidebar-primary text-sidebar-primary-foreground grid size-8 shrink-0 place-items-center rounded-lg"
			>
				<PackageIcon class="size-4" />
			</span>
			<span class="grid leading-tight group-data-[collapsible=icon]:hidden">
				<strong class="text-sm font-semibold">{APP_NAME}</strong>
				<small class="text-muted-foreground text-xs">{APP_TAGLINE}</small>
			</span>
		</a>
	</SidebarHeader>

	<SidebarContent>
		<SidebarGroup>
			<SidebarGroupLabel>Gestión</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{#each NAV_LINKS as link (link.href)}
						{@const Icon = icons[link.href] ?? PackageIcon}
						{@const count = counts[link.href]}
						<SidebarMenuItem>
							<SidebarMenuButton
								isActive={isCurrent(link.href)}
								tooltipContent={link.label}
								class="data-active:shadow-[inset_2px_0_0_var(--color-primary)] transition-colors"
							>
								{#snippet child({ props })}
									<a href={link.href} {...props}>
										<Icon />
										<span>{link.label}</span>
									</a>
								{/snippet}
							</SidebarMenuButton>

							{#if count && count.total > 0}
								<SidebarMenuBadge
									class={count.urgent
										? 'bg-destructive/15 text-destructive'
										: 'bg-amber-500/15 text-amber-700 dark:text-amber-400'}
								>
									{count.total}
									<span class="sr-only">
										{link.href === '/vencimientos' ? 'lotes por vencer' : 'productos para reponer'}
									</span>
								</SidebarMenuBadge>
							{/if}
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	</SidebarContent>

</Sidebar>
