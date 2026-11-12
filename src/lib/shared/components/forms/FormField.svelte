<script>
	import { Label } from '#lib/shared/components/ui/label/index.js';

	/**
	 * @type {{
	 *   label: string,
	 *   error?: string,
	 *   hint?: string,
	 *   required?: boolean,
	 *   class?: string,
	 *   children: import('svelte').Snippet<[{ id: string, describedBy: string | undefined, invalid: boolean }]>
	 * }}
	 */
	let { label, error = '', hint = '', required = false, class: className = '', children } = $props();

	const uid = $props.id();
	const hintId = uid + '-hint';
	const errorId = uid + '-error';
	const describedBy = $derived(
		[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
	);
</script>

<div class="grid min-w-0 content-start gap-1.5 {className}">
	<Label for={uid} class="leading-tight">
		{label}
		{#if required}
			<span aria-hidden="true" class="text-destructive">*</span>
			<span class="sr-only">(obligatorio)</span>
		{/if}
	</Label>

	{@render children({ id: uid, describedBy, invalid: Boolean(error) })}

	{#if hint || error}
		<div class="grid gap-0.5">
			{#if hint}
				<p id={hintId} class="text-muted-foreground text-xs leading-snug">{hint}</p>
			{/if}
			{#if error}
				<p id={errorId} class="text-destructive text-xs leading-snug font-medium">{error}</p>
			{/if}
		</div>
	{/if}
</div>
