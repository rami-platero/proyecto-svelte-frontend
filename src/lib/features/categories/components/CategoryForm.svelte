<script>
	import PlusIcon from '@lucide/svelte/icons/plus';
	import FormField from '#lib/shared/components/forms/FormField.svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Input } from '#lib/shared/components/ui/input/index.js';
	import { status } from '#lib/shared/state/status.svelte.js';
	import { addCategory, categoryExists } from '../state/categories.svelte.js';

	/** @type {{ oncreated?: (category: import('../types.js').Category) => void }} */
	let { oncreated } = $props();

	let name = $state('');
	let error = $state('');

	/** @param {SubmitEvent} event */
	async function submit(event) {
		event.preventDefault();
		const value = name.trim();

		if (value.length < 2) {
			error = 'Escribí un nombre de al menos 2 caracteres.';
			return;
		}

		if (categoryExists(value)) {
			error = 'Ya existe una categoría con ese nombre.';
			return;
		}

		error = '';
		const created = await addCategory(value);

		if (created) {
			name = '';
			oncreated?.(created);
		}
	}
</script>

<form onsubmit={submit} novalidate class="grid gap-3">
	<FormField label="Nombre" {error} required>
		{#snippet children({ id, describedBy, invalid })}
			<Input
				{id}
				bind:value={name}
				aria-describedby={describedBy}
				aria-invalid={invalid}
				placeholder="Lácteos"
				autocomplete="off"
			/>
		{/snippet}
	</FormField>
	<Button type="submit" class="justify-self-start" disabled={status.busy}>
		<PlusIcon />
		Agregar categoría
	</Button>
</form>
