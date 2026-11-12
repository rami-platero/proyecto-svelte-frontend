<script>
	/** @import { Category } from '#lib/features/categories/types.js' */
	/** @import { Product, ProductInput } from '#lib/features/products/types.js' */
	import CheckIcon from '@lucide/svelte/icons/check';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import FormField from '#lib/shared/components/forms/FormField.svelte';
	import PlusIcon2 from '@lucide/svelte/icons/circle-plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Input } from '#lib/shared/components/ui/input/index.js';
	import { Label } from '#lib/shared/components/ui/label/index.js';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '#lib/shared/components/ui/select/index.js';
	import { Switch } from '#lib/shared/components/ui/switch/index.js';
	import { Textarea } from '#lib/shared/components/ui/textarea/index.js';
	import { UNITS } from '#lib/features/products/domain/constants.js';
	import { addCategory, categories as categoryStore } from '#lib/features/categories/state/categories.svelte.js';
	import { status } from '#lib/shared/state/status.svelte.js';
	import { formatUnits } from '#lib/shared/utils/format.js';
	import { hasErrors } from '#lib/shared/utils/forms.js';
	import { validateProduct } from '../domain/validation.js';

	/**
	 * @type {{
	 *   product?: Product | null,
	 *   categories?: Category[],
	 *   busy?: boolean,
	 *   onsave?: (values: ProductInput) => void,
	 *   oncancel?: () => void
	 * }}
	 */
	let { product = null, categories = [], busy = false, onsave, oncancel } = $props();

	const isEdit = $derived(Boolean(product));

	/** @returns {ProductInput} */
	function initialValues() {
		return {
			name: product?.name ?? '',
			sku: product?.sku ?? '',
			description: product?.description ?? '',
			category_id: product?.category_id ? String(product.category_id) : '',
			unit: product?.unit ?? 'unidad',
			stock: product?.stock ?? 0,
			min_stock: product?.min_stock ?? 0,
			price: product?.price ?? 0,
			perishable: product?.perishable ?? false
		};
	}

	let values = $state(initialValues());
	const perishableId = $props.id();

	let creatingCategory = $state(false);
	let newCategory = $state('');
	let categoryError = $state('');

	async function createCategory() {
		const nombre = newCategory.trim();

		if (nombre.length < 2) {
			categoryError = 'Escribí un nombre de al menos 2 caracteres.';
			return;
		}

		if (categories.some((category) => category.name.toLowerCase() === nombre.toLowerCase())) {
			categoryError = 'Ya existe una categoría con ese nombre.';
			return;
		}

		categoryError = '';
		const created = await addCategory(nombre);

		if (created) {
			const match = categoryStore.items.find((category) => category.name === nombre);
			if (match) values.category_id = String(match.id);
			newCategory = '';
			creatingCategory = false;
		}
	}

	/** @type {Record<string, string>} */
	let errors = $state({});
	let submitted = $state(false);

	const categoryLabel = $derived(
		categories.find((category) => String(category.id) === String(values.category_id))?.name ??
			'Sin categoría'
	);
	const errorCount = $derived(Object.keys(errors).length);

	/** @param {SubmitEvent} event */
	function handleSubmit(event) {
		event.preventDefault();
		submitted = true;
		errors = validateProduct(values);
		if (hasErrors(errors)) return;
		onsave?.({ ...values });
	}
</script>

<form onsubmit={handleSubmit} novalidate class="grid gap-4">
	<div aria-live="polite">
		{#if submitted && errorCount > 0}
			<p class="border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm font-medium">
				Revisá {errorCount === 1 ? 'el campo marcado' : 'los ' + errorCount + ' campos marcados'} para
				poder guardar.
			</p>
		{/if}
	</div>

	<div class="grid items-start gap-4 sm:grid-cols-2">
		<FormField label="Nombre del producto" error={errors.name} required class="sm:col-span-2">
			{#snippet children({ id, describedBy, invalid })}
				<Input
					{id}
					bind:value={values.name}
					aria-describedby={describedBy}
					aria-invalid={invalid}
					placeholder="Nombre del artículo"
					autocomplete="off"
				/>
			{/snippet}
		</FormField>

		<FormField label="Código SKU" error={errors.sku} hint="Identificador único interno." required>
			{#snippet children({ id, describedBy, invalid })}
				<Input
					{id}
					bind:value={values.sku}
					aria-describedby={describedBy}
					aria-invalid={invalid}
					placeholder="SKU-001"
					autocomplete="off"
				/>
			{/snippet}
		</FormField>

		<FormField
			label="Categoría"
			error={categoryError}
			hint={creatingCategory ? "" : "¿No está en la lista? Creala acá mismo."}
		>
			{#snippet children({ id, describedBy, invalid })}
				{#if creatingCategory}
					<div class="flex gap-2">
						<Input
							{id}
							bind:value={newCategory}
							aria-describedby={describedBy}
							aria-invalid={invalid}
							placeholder="Nombre de la categoría"
							autocomplete="off"
							onkeydown={(/** @type {KeyboardEvent} */ event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									createCategory();
								}
							}}
						/>
						<Button type="button" variant="secondary" onclick={createCategory} disabled={status.busy}>
							Crear
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onclick={() => {
								creatingCategory = false;
								categoryError = "";
							}}
						>
							<XIcon />
							<span class="sr-only">Cancelar la creación de categoría</span>
						</Button>
					</div>
				{:else}
					<div class="flex gap-2">
						<Select type="single" bind:value={values.category_id}>
							<SelectTrigger {id} class="w-full">{categoryLabel}</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Sin categoría</SelectItem>
								{#each categories as category (category.id)}
									<SelectItem value={String(category.id)} label={category.name}>
										{category.name}
									</SelectItem>
								{/each}
							</SelectContent>
						</Select>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onclick={() => (creatingCategory = true)}
						>
							<PlusIcon2 />
							<span class="sr-only">Crear una categoría nueva</span>
						</Button>
					</div>
				{/if}
			{/snippet}
		</FormField>

		<FormField label="Unidad">
			{#snippet children({ id })}
				<Select type="single" bind:value={values.unit}>
					<SelectTrigger {id} class="w-full">{values.unit}</SelectTrigger>
					<SelectContent>
						{#each UNITS as unit (unit)}
							<SelectItem value={unit} label={unit}>{unit}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			{/snippet}
		</FormField>

		<FormField label="Precio unitario" error={errors.price}>
			{#snippet children({ id, describedBy, invalid })}
				<Input
					{id}
					type="number"
					bind:value={values.price}
					aria-describedby={describedBy}
					aria-invalid={invalid}
					min="0"
					step="100"
				/>
			{/snippet}
		</FormField>

		{#if product}
			<div class="border-input bg-muted/40 grid content-start gap-0.5 rounded-md border border-dashed px-3 py-2">
				<p class="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Stock actual</p>
				<p class="font-bold tabular-nums">{formatUnits(product.stock, product.unit)}</p>
				<p class="text-muted-foreground text-xs">
					Se modifica desde Movimientos, así queda historial.
				</p>
			</div>
		{:else}
			<FormField label="Stock inicial" error={errors.stock}>
				{#snippet children({ id, describedBy, invalid })}
					<Input
						{id}
						type="number"
						bind:value={values.stock}
						aria-describedby={describedBy}
						aria-invalid={invalid}
						min="0"
						step="1"
					/>
				{/snippet}
			</FormField>
		{/if}

		<FormField
			label="Stock mínimo"
			error={errors.min_stock}
			hint="Por debajo de este valor la app avisa que hay que reponer."
		>
			{#snippet children({ id, describedBy, invalid })}
				<Input
					{id}
					type="number"
					bind:value={values.min_stock}
					aria-describedby={describedBy}
					aria-invalid={invalid}
					min="0"
					step="1"
				/>
			{/snippet}
		</FormField>

		<div class="flex items-start gap-3 rounded-md border p-3 sm:col-span-2">
			<Switch id={perishableId} bind:checked={values.perishable} />
			<div class="grid gap-0.5">
				<Label for={perishableId}>Producto perecedero</Label>
				<p class="text-muted-foreground text-xs">
					Cada entrada va a pedir el lote y su fecha de vencimiento, y la app avisa cuando se
					acercan. El stock pasa a calcularse como la suma de los lotes.
				</p>
			</div>
		</div>

		<FormField label="Descripción" hint="Detalles, medidas, marca o estado." class="sm:col-span-2">
			{#snippet children({ id, describedBy })}
				<Textarea {id} bind:value={values.description} aria-describedby={describedBy} rows={3} />
			{/snippet}
		</FormField>
	</div>

	<div class="flex flex-wrap justify-end gap-2">
		<Button type="button" variant="outline" onclick={oncancel}>Cancelar</Button>
		<Button type="submit" disabled={busy}>
			{#if isEdit}<CheckIcon />{:else}<PlusIcon />{/if}
			{isEdit ? 'Guardar cambios' : 'Agregar producto'}
		</Button>
	</div>
</form>
