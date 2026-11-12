<script>
	import CalendarClockIcon from '@lucide/svelte/icons/calendar-clock';
	import {
		DiscardBatchDialog,
		EXPIRY_WARNING_DAYS,
		ExpiryList,
		ExpiryListSkeleton,
		ExpiryStats,
		batches,
		loadExpiringBatches
	} from '#lib/features/expiry/index.js';
	import { summary } from '#lib/features/dashboard/index.js';
	import EmptyState from '#lib/shared/components/feedback/EmptyState.svelte';
	import ErrorAlert from '#lib/shared/components/feedback/ErrorAlert.svelte';
	import SupabaseSetupNotice from '#lib/shared/components/feedback/SupabaseSetupNotice.svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Card } from '#lib/shared/components/ui/card/index.js';
	import { APP_NAME } from '#lib/shared/config/app.js';
	import { syncStateWithQuery } from '#lib/shared/hooks/query-sync.svelte.js';
	import { dismissError, status } from '#lib/shared/state/status.svelte.js';
	import { configured, onDataChange, refreshAll } from '#lib/layout/state/bootstrap.svelte.js';

	const PER_PAGE = 8;
	const DEFAULT_EXPIRY_FILTERS = { page: '1' };

	/** @type {import('#lib/features/expiry/types.js').Batch | null} */
	let discarding = $state(null);

	const expiryFilters = $state({ ...DEFAULT_EXPIRY_FILTERS });
	syncStateWithQuery(expiryFilters, DEFAULT_EXPIRY_FILTERS);

	const query = $derived({ page: Number(expiryFilters.page) || 1, perPage: PER_PAGE });

	$effect(() => {
		void loadExpiringBatches(query, { silent: true });
	});

	$effect(() => onDataChange(() => loadExpiringBatches(query, { silent: true })));

	/** @param {number} value */
	function goToPage(value) {
		expiryFilters.page = String(value);
	}

	/**
	 * Hay productos perecederos si la base reporta lotes en alguna categoría
	 * de vencimiento, o si ya hay lotes cargados en esta página.
	 */
	const hasPerishables = $derived(
		summary.data.expiringCount > 0 || summary.data.expiredCount > 0 || batches.total > 0
	);
</script>

<svelte:head>
	<title>Vencimientos · {APP_NAME}</title>
</svelte:head>

<div class="grid gap-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">Vencimientos</h1>
		<p class="text-muted-foreground mt-1 max-w-[70ch] text-sm">
			Lotes de productos perecederos que vencen dentro de {EXPIRY_WARNING_DAYS} días o que ya
			vencieron, con una sugerencia de qué hacer con cada uno.
		</p>
	</div>

	{#if !configured}
		<SupabaseSetupNotice />
	{:else}
		{#if status.error}
			<ErrorAlert error={status.error} onretry={refreshAll} ondismiss={dismissError} />
		{/if}

		{#if status.loading && batches.items.length === 0}
			<ExpiryListSkeleton />
		{:else if !hasPerishables}
			<Card>
				<EmptyState
					icon={CalendarClockIcon}
					title="Ningún producto perecedero"
					description="Marcá un producto como perecedero al crearlo o editarlo. A partir de ahí, cada entrada va a pedir el lote y su fecha de vencimiento."
				>
					<Button href="/productos">Ir a productos</Button>
				</EmptyState>
			</Card>
		{:else}
			<ExpiryStats />
			<ExpiryList
				batches={batches.items}
				total={batches.total}
				page={Number(expiryFilters.page) || 1}
				perPage={PER_PAGE}
				onpagechange={goToPage}
				ondiscard={(batch) => (discarding = batch)}
			/>
		{/if}
	{/if}
</div>

<DiscardBatchDialog
	batch={discarding}
	onclose={() => (discarding = null)}
	ondiscarded={refreshAll}
/>
