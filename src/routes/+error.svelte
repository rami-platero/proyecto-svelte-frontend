<script>
	import { page } from '$app/state';
	import { dev } from '$app/env';
	import HouseIcon from '@lucide/svelte/icons/house';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Card, CardContent } from '#lib/shared/components/ui/card/index.js';
	import { APP_NAME } from '#lib/shared/config/app.js';

	/** @type {Record<number, { title: string, detail: string }>} */
	const copy = {
		404: {
			title: 'Esta página no existe',
			detail: 'Puede que el enlace esté mal escrito o que la sección se haya movido.'
		},
		500: {
			title: 'Algo se rompió de nuestro lado',
			detail:
				'La app encontró un error inesperado. Tus datos están a salvo: nada de lo que hiciste se perdió.'
		}
	};

	const info = $derived(
		copy[page.status] ?? {
			title: 'Ocurrió un error',
			detail: 'No pudimos completar lo que estabas haciendo.'
		}
	);
</script>

<svelte:head>
	<title>Error {page.status} · {APP_NAME}</title>
</svelte:head>

<div class="grid min-h-[60vh] place-items-center p-4">
	<Card class="w-full max-w-lg">
		<CardContent class="grid gap-5 text-center">
			<div class="grid justify-items-center gap-3">
				<span
					class="bg-destructive/10 text-destructive grid size-14 place-items-center rounded-full"
				>
					<TriangleAlertIcon class="size-7" />
				</span>
				<p class="text-muted-foreground font-mono text-sm">Error {page.status}</p>
				<h1 class="text-2xl font-bold tracking-tight">{info.title}</h1>
				<p class="text-muted-foreground max-w-[46ch] text-sm">{info.detail}</p>
			</div>

			{#if dev && page.error?.message}
				<pre
					class="bg-muted text-muted-foreground max-h-40 overflow-auto rounded-md p-3 text-start text-xs whitespace-pre-wrap">{page
						.error.message}</pre>
			{/if}

			<div class="flex flex-wrap justify-center gap-2">
				<Button href="/">
					<HouseIcon />
					Volver al panel
				</Button>
				<Button variant="outline" onclick={() => location.reload()}>
					<RefreshCwIcon />
					Reintentar
				</Button>
			</div>
		</CardContent>
	</Card>
</div>
