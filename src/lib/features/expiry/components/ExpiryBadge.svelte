<script>
	import ClockIcon from '@lucide/svelte/icons/clock';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Badge } from '#lib/shared/components/ui/badge/index.js';
	import { daysUntil, describeDays, getExpiryStatus } from '#lib/features/expiry/domain/expiry.js';

	/** @type {{ batch: import('#lib/features/expiry/types.js').Batch, withDays?: boolean }} */
	let { batch, withDays = true } = $props();

	const status = $derived(getExpiryStatus(batch));
	const days = $derived(daysUntil(batch.expires_at));

	/** @type {Record<string, { variant: 'destructive' | 'outline', class: string }>} */
	const styles = {
		expired: { variant: 'destructive', class: '' },
		critical: { variant: 'destructive', class: '' },
		soon: {
			variant: 'outline',
			class: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
		},
		ok: {
			variant: 'outline',
			class: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
		}
	};
</script>

<Badge variant={styles[status.id].variant} class={styles[status.id].class}>
	{#if status.id === 'expired' || status.id === 'critical'}
		<TriangleAlertIcon />
	{:else if status.id === 'soon'}
		<ClockIcon />
	{/if}
	{withDays ? describeDays(days) : status.label}
</Badge>
