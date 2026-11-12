<script>
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { mode, toggleMode } from 'mode-watcher';
	import { Button } from '#lib/shared/components/ui/button/index.js';

	const isDark = $derived(mode.current === 'dark');
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={toggleMode}
	aria-pressed={isDark}
	title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
>
	<SunIcon class="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
	<MoonIcon
		class="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">{isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}</span>
</Button>
