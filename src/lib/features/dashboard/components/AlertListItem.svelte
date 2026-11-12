<script>
	/** @import { Alert } from '../domain/alerts.js' */
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
	import PackageXIcon from '@lucide/svelte/icons/package-x';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Button } from '#lib/shared/components/ui/button/index.js';

	/** @type {{ alert: Alert }} */
	let { alert } = $props();

	const Icon = $derived(
		alert.source === 'stock' ? TriangleAlertIcon : alert.urgent ? PackageXIcon : CalendarClockIcon
	);
</script>

<li class="flex items-center gap-3 px-6 py-3 {alert.urgent ? 'bg-destructive/5' : ''}">
	<span
		class="grid size-8 shrink-0 place-items-center rounded-full {alert.urgent
			? 'bg-destructive/15 text-destructive'
			: 'bg-amber-500/15 text-amber-700 dark:text-amber-400'}"
		aria-hidden="true"
	>
		<Icon class="size-4" />
	</span>

	<div class="min-w-0 flex-1">
		<p class="truncate text-sm font-medium">{alert.titulo}</p>
		<p class="text-muted-foreground truncate text-xs">{alert.detalle}</p>
	</div>

	<Button variant="outline" size="sm" class="shrink-0" href={alert.href}>
		{alert.accion}
		<ArrowRightIcon />
	</Button>
</li>
