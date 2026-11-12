<script>
	import BanknoteIcon from '@lucide/svelte/icons/banknote';
	import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
	import LayersIcon from '@lucide/svelte/icons/layers';
	import PackageIcon from '@lucide/svelte/icons/package';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import StatTile from '#lib/shared/components/data/StatTile.svelte';
	import { formatMoney, formatNumber } from '#lib/shared/utils/format.js';
	import { summary } from '../state/summary.svelte.js';

	const data = $derived(summary.data);
</script>

<section
	aria-labelledby="resumen-titulo"
	class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
>
	<h2 class="sr-only" id="resumen-titulo">Resumen del inventario</h2>

	<StatTile
		label="Productos"
		value={formatNumber(data.productCount)}
		hint={data.categoryCount + ' categorías'}
		icon={PackageIcon}
	/>
	<StatTile
		label="Unidades en stock"
		value={formatNumber(data.totalUnits)}
		hint="Suma de todas las existencias"
		icon={LayersIcon}
	/>
	<StatTile
		label="Valor del inventario"
		value={formatMoney(data.inventoryValue)}
		hint="Stock por precio unitario"
		icon={BanknoteIcon}
	/>

	{#if data.expiringCount > 0 || data.expiredCount > 0}
		<StatTile
			label="Lotes por vencer"
			value={data.expiringCount}
			hint={data.expiredCount > 0 ? data.expiredCount + ' ya vencidos' : 'Ninguno vencido todavía'}
			icon={CalendarClockIcon}
			tone={data.expiredCount > 0 ? 'danger' : 'warning'}
		/>
	{/if}

	<StatTile
		label="Para reponer"
		value={formatNumber(data.restockCount)}
		hint={data.outOfStockCount > 0 ? data.outOfStockCount + ' sin stock' : 'Ninguno sin stock'}
		icon={TriangleAlertIcon}
		tone={data.outOfStockCount > 0 ? 'danger' : data.restockCount > 0 ? 'warning' : 'default'}
	/>
</section>
