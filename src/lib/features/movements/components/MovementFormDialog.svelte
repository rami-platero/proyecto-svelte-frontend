<script>
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '#lib/shared/components/ui/dialog/index.js';
	import { applyMovement } from '../state/movements.svelte.js';
	import { products } from '#lib/features/products/state/products.svelte.js';
	import { status } from '#lib/shared/state/status.svelte.js';
	import MovementForm from './MovementForm.svelte';

	/**
	 * @type {{
	 *   preset?: import('#lib/features/movements/types.js').MovementInput | null,
	 *   onclose?: () => void,
	 *   onsaved?: () => void
	 * }}
	 */
	let { preset = null, onclose, onsaved } = $props();

	/** @param {import('#lib/features/movements/types.js').MovementInput} values */
	async function save(values) {
		const saved = await applyMovement(values);
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

<Dialog open={Boolean(preset)} onOpenChange={handleOpenChange}>
	<DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
		<DialogHeader>
			<DialogTitle>Registrar movimiento de stock</DialogTitle>
			<DialogDescription>
				El stock se recalcula en Supabase y queda asentado en el historial.
			</DialogDescription>
		</DialogHeader>

		{#if preset}
			<MovementForm
				products={products.options}
				{preset}
				busy={status.busy}
				onsave={save}
				oncancel={onclose}
			/>
		{/if}
	</DialogContent>
</Dialog>
