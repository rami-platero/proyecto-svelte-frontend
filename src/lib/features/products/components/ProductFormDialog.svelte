<script>
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '#lib/shared/components/ui/dialog/index.js';
	import { saveProduct } from '../state/products.svelte.js';
	import { categories } from '#lib/features/categories/state/categories.svelte.js';
	import { status } from '#lib/shared/state/status.svelte.js';
	import ProductForm from './ProductForm.svelte';

	/**
	 * @type {{
	 *   open?: boolean,
	 *   product?: import('#lib/features/products/types.js').Product | null,
	 *   onclose?: () => void,
	 *   onsaved?: () => void
	 * }}
	 */
	let { open = false, product = null, onclose, onsaved } = $props();

	/** @param {import('#lib/features/products/types.js').ProductInput} values */
	async function save(values) {
		const saved = await saveProduct(values, product?.id ?? null);
		if (saved) {
			onclose?.();
			onsaved?.();
		}
	}

	/** @param {boolean} value */
	function handleOpenChange(value) {
		if (!value) onclose?.();
	}
</script>

<Dialog {open} onOpenChange={handleOpenChange}>
	<DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
		<DialogHeader>
			<DialogTitle>{product ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
			<DialogDescription>
				{product
					? 'Cambiá los datos del producto. El stock se mueve desde Movimientos.'
					: 'Cargá un producto nuevo con su stock inicial y su mínimo de reposición.'}
			</DialogDescription>
		</DialogHeader>

		{#if open}
			<ProductForm
				{product}
				categories={categories.items}
				busy={status.busy}
				onsave={save}
				oncancel={onclose}
			/>
		{/if}
	</DialogContent>
</Dialog>
