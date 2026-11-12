<script>
	import { Card, CardContent } from '#lib/shared/components/ui/card/index.js';
	import { cn } from '#lib/shared/utils/cn.js';

	/**
	 * @type {{
	 *   label: string,
	 *   value: string | number,
	 *   hint?: string,
	 *   icon?: import("svelte").Component | null,
	 *   tone?: 'default' | 'warning' | 'danger'
	 * }}
	 */
	let { label, value, hint = '', icon: Icon = null, tone = 'default' } = $props();

	const tones = {
		default: 'bg-muted text-muted-foreground',
		warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
		danger: 'bg-destructive/15 text-destructive'
	};
</script>

<Card>
	<CardContent class="flex items-start gap-3">
		{#if Icon}
			<span class={cn('grid size-10 shrink-0 place-items-center rounded-lg', tones[tone])}>
				<Icon class="size-5" />
			</span>
		{/if}
		<div class="min-w-0">
			<p class="text-muted-foreground text-xs font-semibold tracking-wide uppercase">{label}</p>
			<p class="mt-0.5 text-xl leading-tight font-bold break-words tabular-nums sm:text-2xl">{value}</p>
			{#if hint}
				<p class="text-muted-foreground mt-1 text-xs">{hint}</p>
			{/if}
		</div>
	</CardContent>
</Card>
