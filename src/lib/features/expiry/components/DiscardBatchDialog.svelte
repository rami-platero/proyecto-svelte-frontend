<script>
	/** @import { Batch } from '../types.js' */
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
	import { applyMovement } from '#lib/features/movements/state/movements.svelte.js';

	/** @type {{ batch?: Batch | null, onclose?: () => void, ondiscarded?: () => void }} */
	let { batch = null, onclose, ondiscarded } = $props();

	/** @param {boolean} value */
	function handleOpenChange(value) {
		if (!value) onclose?.();
	}

	async function confirm() {
		if (!batch) return;
		const done = await applyMovement({
			product_id: batch.product_id,
			type: 'outbound',
			quantity: batch.quantity,
			reason: 'Merma por vencimiento',
			batch_id: batch.id
		});
		if (done) {
			onclose?.();
			ondiscarded?.();
		}
	}
</script>

<AlertDialog open={Boolean(batch)} onOpenChange={handleOpenChange}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>¿Dar de baja el lote vencido?</AlertDialogTitle>
			<AlertDialogDescription>
				{#if batch}
					Se registra una salida de {formatUnits(batch.quantity, batch.unit)} de
					<strong>{batch.product}</strong> con el motivo "Merma por vencimiento". El stock baja y
					queda asentado en el historial.
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
				Sí, dar de baja
			</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
