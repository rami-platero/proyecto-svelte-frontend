<script>
	import {
		Pagination,
		PaginationContent,
		PaginationEllipsis,
		PaginationItem,
		PaginationLink,
		PaginationNextButton,
		PaginationPrevButton
	} from '#lib/shared/components/ui/pagination/index.js';

	/**
	 * Paginador controlado: no guarda la página, la recibe y avisa cuando
	 * cambia. Así quien lo usa decide dónde vive ese estado (en la URL, por
	 * ejemplo) y qué pedirle a la base.
	 *
	 * @type {{
	 *   page?: number,
	 *   total: number,
	 *   perPage?: number,
	 *   label?: string,
	 *   onchange?: (page: number) => void
	 * }}
	 */
	let { page = 1, total, perPage = 10, label = 'elementos', onchange } = $props();

	const from = $derived(total === 0 ? 0 : (page - 1) * perPage + 1);
	const to = $derived(Math.min(page * perPage, total));

	/** @param {number} value */
	function change(value) {
		if (value !== page) onchange?.(value);
	}
</script>

{#if total > perPage}
	<div
		class="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:px-6"
	>
		<p class="text-muted-foreground text-xs" aria-live="polite">
			Mostrando <strong class="text-foreground">{from}–{to}</strong> de {total}
			{label}
		</p>

		<Pagination
			count={total}
			{perPage}
			{page}
			onPageChange={change}
			class="mx-0 w-auto justify-end"
		>
			{#snippet children(/** @type {{ pages: { key: string, type: string, value: number }[], currentPage: number }} */ { pages, currentPage })}
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevButton />
					</PaginationItem>

					{#each pages as pageItem (pageItem.key)}
						{#if pageItem.type === 'ellipsis'}
							<PaginationItem class="hidden sm:block">
								<PaginationEllipsis />
							</PaginationItem>
						{:else}
							<PaginationItem class="hidden sm:block">
								<PaginationLink page={pageItem} isActive={currentPage === pageItem.value}>
									{pageItem.value}
								</PaginationLink>
							</PaginationItem>
						{/if}
					{/each}

					<PaginationItem>
						<PaginationNextButton />
					</PaginationItem>
				</PaginationContent>
			{/snippet}
		</Pagination>
	</div>
{/if}
