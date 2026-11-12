<script>
	/** @import { Product } from '../types.js' */
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '#lib/shared/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '#lib/shared/components/ui/button/index.js';
	import { status } from '#lib/shared/state/status.svelte.js';
	import { formatUnits } from '#lib/shared/utils/format.js';
	import { removeProduct } from '../state/products.svelte.js';

	/** @type {{ product?: Product | null, onclose?: () => void, ondeleted?: () => void }} */
	let { product = null, onclose, ondeleted } = $props();

	/** @param {boolean} value */
	function handleOpenChange(value) {
		if (!value) onclose?.();
	}

	async function confirm() {
		if (!product) return;
		const removed = await removeProduct(product);
		if (removed) {
			onclose?.();
			ondeleted?.();
		}
	}
</script>

<AlertDialog open={Boolean(product)} onOpenChange={handleOpenChange}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>¿Borrar este producto?</AlertDialogTitle>
			<AlertDialogDescription>
				{#if product}
					Se borra <strong>{product.name}</strong> ({product.sku}) junto con sus
					{formatUnits(product.stock, product.unit)} en stock y todo su historial de movimientos.
					Esta acción no se puede deshacer.
				{/if}
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancelar</AlertDialogCancel>
			<AlertDialogAction
				class={buttonVariants({ variant: 'destructive' })}
				disabled={status.busy}
				onclick={confirm}
			>
				Sí, borrar
			</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
