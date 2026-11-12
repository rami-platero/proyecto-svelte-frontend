<script>
	/** @import { Movement } from '../types.js' */
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import { formatDateTime } from '#lib/shared/utils/format.js';

	/** @type {{ movement: Movement }} */
	let { movement } = $props();

	/** @type {Record<string, { icon: import('svelte').Component, label: string, sign: string, badge: string, amount: string }>} */
	const meta = {
		inbound: {
			icon: ArrowUpIcon,
			label: 'Entrada',
			sign: '+',
			badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
			amount: 'text-emerald-600 dark:text-emerald-400'
		},
		outbound: {
			icon: ArrowDownIcon,
			label: 'Salida',
			sign: '−',
			badge: 'bg-destructive/15 text-destructive',
			amount: 'text-destructive'
		},
		adjustment: {
			icon: RefreshCwIcon,
			label: 'Ajuste',
			sign: '=',
			badge: 'bg-muted text-muted-foreground',
			amount: 'text-foreground'
		}
	};

	const info = $derived(meta[movement.type] ?? meta.adjustment);
	const Icon = $derived(info.icon);
</script>

<li class="flex items-center gap-3 px-6 py-3">
	<span class="grid size-8 shrink-0 place-items-center rounded-full {info.badge}" aria-hidden="true">
		<Icon class="size-4" />
	</span>

	<div class="min-w-0 flex-1">
		<p class="flex flex-wrap items-baseline gap-1.5 text-sm">
			<strong class="truncate">{movement.product}</strong>
			<span class="text-muted-foreground font-mono text-xs">{movement.sku}</span>
		</p>
		<p class="text-muted-foreground flex flex-wrap gap-1.5 text-xs">
			{info.label}
			<span aria-hidden="true">·</span>
			<time datetime={movement.created_at}>{formatDateTime(movement.created_at)}</time>
			{#if movement.reason}
				<span aria-hidden="true">·</span>
				<span class="truncate">{movement.reason}</span>
			{/if}
		</p>
	</div>

	<p class="flex flex-col items-end leading-tight tabular-nums whitespace-nowrap">
		<strong class="text-base {info.amount}">
			<span class="sr-only">{info.label} de</span>
			{info.sign}{movement.quantity}
		</strong>
		<span class="text-muted-foreground text-xs">quedó en {movement.resulting_stock}</span>
	</p>
</li>
