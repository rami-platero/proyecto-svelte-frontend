<script>
	/** @import { Product } from '#lib/features/products/types.js' */
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList
	} from '#lib/shared/components/ui/command/index.js';
	import { Popover, PopoverContent, PopoverTrigger } from '#lib/shared/components/ui/popover/index.js';
	import { getStockStatus } from '#lib/features/products/domain/stock.js';

	/**
	 * @type {{
	 *   products?: Product[],
	 *   value?: string | number,
	 *   id?: string,
	 *   describedBy?: string,
	 *   invalid?: boolean,
	 *   placeholder?: string
	 * }}
	 */
	let {
		products = [],
		value = $bindable(''),
		id = undefined,
		describedBy = undefined,
		invalid = false,
		placeholder = 'Buscá y elegí un producto'
	} = $props();

	let open = $state(false);
	/** @type {HTMLButtonElement | null} */
	let triggerRef = $state(null);

	const selected = $derived(
		products.find((product) => String(product.id) === String(value)) ?? null
	);

	/** @param {string} productId */
	function pick(productId) {
		value = productId;
		open = false;
		tick().then(() => triggerRef?.focus());
	}
</script>

<Popover bind:open>
	<PopoverTrigger bind:ref={triggerRef}>
		{#snippet child(/** @type {{ props: Record<string, any> }} */ { props })}
			<Button
				{...props}
				{id}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-invalid={invalid}
				aria-describedby={describedBy}
				class="w-full justify-between font-normal"
			>
				<span class="truncate {selected ? '' : 'text-muted-foreground'}">
					{selected ? selected.name : placeholder}
				</span>
				<ChevronsUpDownIcon class="shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</PopoverTrigger>

	<PopoverContent class="w-[var(--bits-popover-anchor-width)] p-0" align="start">
		<Command>
			<CommandInput placeholder="Buscar por nombre o SKU…" />
			<CommandList>
				<CommandEmpty>Ningún producto coincide.</CommandEmpty>
				<CommandGroup>
					{#each products as product (product.id)}
						{@const status = getStockStatus(product)}
						<CommandItem
							value={product.name + ' ' + product.sku + ' ' + product.category}
							onSelect={() => pick(String(product.id))}
						>
							<CheckIcon
								class={String(value) === String(product.id) ? 'opacity-100' : 'opacity-0'}
							/>
							<span class="min-w-0 flex-1 truncate">{product.name}</span>
							<span class="text-muted-foreground shrink-0 font-mono text-xs">{product.sku}</span>
							<span
								class="shrink-0 text-xs tabular-nums {status.id === 'out'
									? 'text-destructive'
									: status.id === 'low'
										? 'text-amber-600 dark:text-amber-400'
										: 'text-muted-foreground'}"
							>
								{product.stock}
							</span>
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
