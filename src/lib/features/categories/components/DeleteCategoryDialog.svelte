<script>
	/** @import { CategoryWithStats } from '../types.js' */
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
	import { removeCategory } from '../state/categories.svelte.js';

	/** @type {{ category?: CategoryWithStats | null, onclose?: () => void }} */
	let { category = null, onclose } = $props();

	/** @param {boolean} value */
	function handleOpenChange(value) {
		if (!value) onclose?.();
	}

	async function confirm() {
		if (!category) return;
		const removed = await removeCategory(category);
		if (removed) onclose?.();
	}
</script>

<AlertDialog open={Boolean(category)} onOpenChange={handleOpenChange}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>¿Borrar esta categoría?</AlertDialogTitle>
			<AlertDialogDescription>
				{#if category}
					Se borra la categoría <strong>{category.name}</strong>.
					{#if category.total > 0}
						Sus {category.total}
						{category.total === 1 ? 'producto queda' : 'productos quedan'} sin categoría, pero no se
						borran.
					{/if}
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
