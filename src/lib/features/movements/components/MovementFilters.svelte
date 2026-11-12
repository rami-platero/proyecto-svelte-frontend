<script>
	import SearchIcon from '@lucide/svelte/icons/search';
	import FormField from '#lib/shared/components/forms/FormField.svelte';
	import { Input } from '#lib/shared/components/ui/input/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '#lib/shared/components/ui/select/index.js';
	import { MOVEMENT_TYPES } from '../domain/constants.js';

	/** @type {{ query?: string, type?: string }} */
	let { query = $bindable(''), type = $bindable('all') } = $props();

	const options = [
		{ value: 'all', label: 'Todos los tipos' },
		...MOVEMENT_TYPES.map((option) => ({ value: option.value, label: option.label }))
	];

	const typeLabel = $derived(
		options.find((option) => option.value === type)?.label ?? 'Todos los tipos'
	);
</script>

<div class="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
	<FormField label="Buscar">
		{#snippet children({ id })}
			<div class="relative">
				<SearchIcon
					class="text-muted-foreground pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2"
				/>
				<Input {id} type="search" bind:value={query} placeholder="Producto o motivo" class="ps-8" />
			</div>
		{/snippet}
	</FormField>

	<FormField label="Tipo">
		{#snippet children({ id })}
			<Select type="single" bind:value={type}>
				<SelectTrigger {id} class="w-full">{typeLabel}</SelectTrigger>
				<SelectContent>
					{#each options as option (option.value)}
						<SelectItem value={option.value} label={option.label}>{option.label}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
		{/snippet}
	</FormField>
</div>
