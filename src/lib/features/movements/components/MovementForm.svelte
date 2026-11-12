<script>
	/** @import { MovementInput } from '#lib/features/movements/types.js' */
	/** @import { Product } from '#lib/features/products/types.js' */
	import CheckIcon from '@lucide/svelte/icons/check';
	import InfoIcon from '@lucide/svelte/icons/info';
	import FormField from '#lib/shared/components/forms/FormField.svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Input } from '#lib/shared/components/ui/input/index.js';
	import { Label } from '#lib/shared/components/ui/label/index.js';
	import { RadioGroup, RadioGroupItem } from '#lib/shared/components/ui/radio-group/index.js';
	import DatePickerField from '#lib/shared/components/forms/DatePickerField.svelte';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '#lib/shared/components/ui/select/index.js';
	import ProductCombobox from '#lib/features/products/components/ProductCombobox.svelte';
	import { MOVEMENT_TYPES } from '#lib/features/movements/domain/constants.js';
	import { loadBatchesOf } from '#lib/features/expiry/state/batches.svelte.js';
	import { describeDays, daysUntil } from '#lib/features/expiry/domain/expiry.js';
	import { formatDate, formatUnits } from '#lib/shared/utils/format.js';
	import { getStockStatus } from '#lib/features/products/domain/stock.js';
	import { hasErrors } from '#lib/shared/utils/forms.js';
	import { validateMovement } from '../domain/validation.js';

	/**
	 * @type {{
	 *   products?: Product[],
	 *   preset?: MovementInput | null,
	 *   busy?: boolean,
	 *   onsave?: (values: MovementInput) => void,
	 *   oncancel?: (() => void) | null,
	 *   submitLabel?: string
	 * }}
	 */
	let {
		products = [],
		preset = null,
		busy = false,
		onsave,
		oncancel = null,
		submitLabel = 'Registrar movimiento'
	} = $props();

	/** @returns {MovementInput} */
	function initialValues() {
		return {
			product_id: preset?.product_id ? String(preset.product_id) : '',
			type: preset?.type ?? 'inbound',
			quantity: preset?.quantity ?? 1,
			reason: preset?.reason ?? '',
			expires_at: preset?.expires_at ?? '',
			batch_code: preset?.batch_code ?? '',
			batch_id: preset?.batch_id ? String(preset.batch_id) : ''
		};
	}

	let values = $state(initialValues());

	/** @type {Record<string, string>} */
	let errors = $state({});
	const uid = $props.id();

	const selected = $derived(
		products.find((product) => String(product.id) === String(values.product_id)) ?? null
	);
	const perishable = $derived(Boolean(selected?.perishable));
	const quantity = $derived(Number(values.quantity) || 0);

	// Los lotes ya no viven en memoria: se piden a la base cuando cambia el
	// producto elegido, y solo si es perecedero.
	/** @type {import('#lib/features/expiry/types.js').Batch[]} */
	let batches = $state([]);

	$effect(() => {
		const id = selected?.id;
		const needsBatches = Boolean(selected?.perishable);

		if (!id || !needsBatches) {
			batches = [];
			return;
		}

		let cancelled = false;
		loadBatchesOf(id).then((result) => {
			if (!cancelled) batches = result;
		});

		return () => {
			cancelled = true;
		};
	});

	const chosenBatch = $derived(
		batches.find((batch) => String(batch.id) === String(values.batch_id)) ?? null
	);

	const batchOptions = $derived(
		batches.map((batch) => ({
			value: String(batch.id),
			label:
				(batch.code ? batch.code + ' · ' : '') +
				formatDate(batch.expires_at) +
				' · ' +
				batch.quantity +
				' u.'
		}))
	);

	const resultingStock = $derived.by(() => {
		if (!selected) return null;
		if (values.type === 'inbound') return selected.stock + quantity;
		if (values.type === 'outbound') return selected.stock - quantity;
		if (perishable) {
			if (!chosenBatch) return null;
			return selected.stock - chosenBatch.quantity + quantity;
		}
		return quantity;
	});

	const preview = $derived.by(() => {
		if (!selected || resultingStock === null) return null;
		const next = { ...selected, stock: Math.max(resultingStock, 0) };
		return { current: selected, next, status: getStockStatus(next) };
	});

	const quantityLabel = $derived(
		values.type === 'adjustment' ? 'Stock final contado' : 'Cantidad de unidades'
	);

	const previewTone = {
		ok: 'text-emerald-600 dark:text-emerald-400',
		warn: 'text-amber-600 dark:text-amber-400',
		danger: 'text-destructive'
	};

	/** @param {SubmitEvent} event */
	function handleSubmit(event) {
		event.preventDefault();
		errors = validateMovement(values, selected);
		if (hasErrors(errors)) return;
		onsave?.({ ...values });
	}
</script>

<form onsubmit={handleSubmit} novalidate class="grid gap-4">
	<FormField label="Producto" error={errors.product_id} required>
		{#snippet children({ id, describedBy, invalid })}
			<ProductCombobox
				{id}
				{products}
				{describedBy}
				{invalid}
				bind:value={values.product_id}
			/>
		{/snippet}
	</FormField>

	<fieldset class="grid gap-2">
		<legend class="mb-1 text-sm font-medium">Tipo de movimiento</legend>
		<RadioGroup bind:value={values.type} class="grid gap-2 md:grid-cols-3">
			{#each MOVEMENT_TYPES as option (option.value)}
				<Label
					for={uid + '-' + option.value}
					class="border-input hover:bg-muted/50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 flex cursor-pointer items-start gap-2 rounded-md border p-3 font-normal"
				>
					<RadioGroupItem id={uid + '-' + option.value} value={option.value} class="mt-0.5" />
					<span class="grid gap-0.5">
						<span class="text-sm font-semibold">{option.label}</span>
						<span class="text-muted-foreground text-xs">{option.help}</span>
					</span>
				</Label>
			{/each}
		</RadioGroup>
	</fieldset>

	{#if perishable}
		<div class="border-input grid gap-3 rounded-md border border-dashed p-3">
			<p class="text-muted-foreground flex items-start gap-1.5 text-xs">
				<InfoIcon class="mt-0.5 size-3.5 shrink-0" />
				<span>
					{#if values.type === 'inbound'}
						Es un producto perecedero: cada entrada crea (o suma a) un lote con su vencimiento.
					{:else if values.type === 'outbound'}
						Si no elegís lote, se descuenta del que vence primero.
					{:else}
						El ajuste de un perecedero se hace sobre un lote puntual.
					{/if}
				</span>
			</p>

			{#if values.type === 'inbound'}
				<div class="grid gap-3 md:grid-cols-2">
					<FormField label="Vence el" error={errors.expires_at} required>
						{#snippet children({ id, describedBy, invalid })}
							<DatePickerField
								{id}
								{describedBy}
								{invalid}
								bind:value={values.expires_at}
								placeholder="Elegí cuándo vence"
							/>
						{/snippet}
					</FormField>
					<FormField label="Código de lote" hint="Opcional: para distinguir tandas.">
						{#snippet children({ id, describedBy })}
							<Input
								{id}
								bind:value={values.batch_code}
								aria-describedby={describedBy}
								placeholder="L-2026-04"
								autocomplete="off"
							/>
						{/snippet}
					</FormField>
				</div>
			{:else if batches.length > 0}
				<FormField
					label={values.type === 'adjustment' ? 'Lote a ajustar' : 'Lote (opcional)'}
					error={errors.batch_id}
					required={values.type === 'adjustment'}
				>
					{#snippet children({ id, describedBy, invalid })}
						<Select type="single" bind:value={values.batch_id}>
							<SelectTrigger {id} class="w-full" aria-describedby={describedBy} aria-invalid={invalid}>
								{chosenBatch
									? (chosenBatch.code ? chosenBatch.code + ' · ' : '') +
										formatDate(chosenBatch.expires_at)
									: values.type === 'adjustment'
										? 'Elegí un lote'
										: 'El que vence primero'}
							</SelectTrigger>
							<SelectContent>
								{#if values.type !== 'adjustment'}
									<SelectItem value="" label="El que vence primero">El que vence primero</SelectItem>
								{/if}
								{#each batchOptions as option (option.value)}
									<SelectItem value={option.value} label={option.label}>{option.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					{/snippet}
				</FormField>

				{#if chosenBatch}
					<p class="text-muted-foreground text-xs">
						Ese lote tiene {formatUnits(chosenBatch.quantity, selected?.unit)} y
						{describeDays(daysUntil(chosenBatch.expires_at))}.
					</p>
				{/if}
			{:else}
				<p class="text-muted-foreground text-xs">
					Este producto todavía no tiene lotes cargados: registrá una entrada primero.
				</p>
			{/if}
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
		<FormField label={quantityLabel} error={errors.quantity} required>
			{#snippet children({ id, describedBy, invalid })}
				<Input
					{id}
					type="number"
					bind:value={values.quantity}
					aria-describedby={describedBy}
					aria-invalid={invalid}
					min={values.type === 'adjustment' ? 0 : 1}
					step="1"
				/>
			{/snippet}
		</FormField>

		<FormField label="Motivo" hint="Opcional: compra, venta, rotura, conteo.">
			{#snippet children({ id, describedBy })}
				<Input {id} bind:value={values.reason} aria-describedby={describedBy} autocomplete="off" />
			{/snippet}
		</FormField>
	</div>

	<div aria-live="polite">
		{#if preview}
			<p class="border-input bg-muted/40 flex flex-wrap items-baseline justify-between gap-2 rounded-md border border-dashed px-3 py-2 text-sm">
				<span>
					{preview.current.name}: {formatUnits(preview.current.stock, preview.current.unit)}
					<span aria-hidden="true">→</span>
					<strong>{formatUnits(preview.next.stock, preview.current.unit)}</strong>
				</span>
				<span class="text-xs font-semibold {previewTone[preview.status.tone]}">
					Queda en: {preview.status.label}
				</span>
			</p>
		{/if}
	</div>

	<div class="flex flex-wrap justify-end gap-2">
		{#if oncancel}
			<Button type="button" variant="outline" onclick={oncancel}>Cancelar</Button>
		{/if}
		<Button type="submit" disabled={busy}>
			<CheckIcon />
			{submitLabel}
		</Button>
	</div>
</form>
