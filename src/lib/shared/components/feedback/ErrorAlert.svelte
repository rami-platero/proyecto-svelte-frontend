<script>
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Alert, AlertDescription, AlertTitle } from '#lib/shared/components/ui/alert/index.js';
	import { Button } from '#lib/shared/components/ui/button/index.js';

	/**
	 * @type {{
	 *   error: import('#lib/shared/types.js').ErrorInfo,
	 *   onretry?: (() => void) | null,
	 *   ondismiss?: (() => void) | null
	 * }}
	 */
	let { error, onretry = null, ondismiss = null } = $props();
</script>

<Alert variant="destructive">
	<TriangleAlertIcon />
	<AlertTitle>{error.message}</AlertTitle>
	{#if error.hint}
		<AlertDescription>{error.hint}</AlertDescription>
	{/if}
	<div class="col-start-2 mt-2 flex flex-wrap gap-2">
		{#if onretry}
			<Button variant="outline" size="sm" onclick={onretry}>
				<RefreshCwIcon />
				Reintentar
			</Button>
		{/if}
		{#if ondismiss}
			<Button variant="ghost" size="sm" onclick={ondismiss}>Ocultar</Button>
		{/if}
	</div>
</Alert>
