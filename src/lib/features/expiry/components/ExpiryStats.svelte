<script>
	import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
	import PackageXIcon from '@lucide/svelte/icons/package-x';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import StatTile from '#lib/shared/components/data/StatTile.svelte';
	import { summary } from '#lib/features/dashboard/state/summary.svelte.js';
	import { EXPIRY_WARNING_DAYS } from '../domain/constants.js';
	import { batches } from '../state/batches.svelte.js';

	const data = $derived(summary.data);

	/** Unidades comprometidas en la página visible de lotes. */
	const unitsAtRisk = $derived(
		batches.items.reduce((total, batch) => total + batch.quantity, 0)
	);
</script>

<section aria-labelledby="resumen-vencimientos" class="grid gap-3 sm:grid-cols-3">
	<h2 class="sr-only" id="resumen-vencimientos">Resumen de vencimientos</h2>
	<StatTile
		label="Lotes vencidos"
		value={data.expiredCount}
		hint={data.expiredCount > 0 ? 'Conviene darlos de baja' : 'Sin pérdidas registradas'}
		icon={PackageXIcon}
		tone={data.expiredCount > 0 ? 'danger' : 'default'}
	/>
	<StatTile
		label="Lotes por vencer"
		value={data.expiringCount}
		hint={'Dentro de ' + EXPIRY_WARNING_DAYS + ' días'}
		icon={CalendarClockIcon}
		tone={data.expiringCount > 0 ? 'warning' : 'default'}
	/>
	<StatTile
		label="Unidades comprometidas"
		value={unitsAtRisk}
		hint="En los lotes de esta página"
		icon={TriangleAlertIcon}
	/>
</section>
