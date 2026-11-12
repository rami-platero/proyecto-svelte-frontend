<script>
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#lib/shared/components/ui/card/index.js';
</script>

<Card>
	<CardHeader class="flex-row items-start gap-3">
		<span class="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400">
			<TriangleAlertIcon class="size-5" />
		</span>
		<div>
			<CardTitle>Falta conectar Supabase</CardTitle>
			<CardDescription>
				La app está lista: solo necesita las credenciales del proyecto y las tablas creadas.
			</CardDescription>
		</div>
	</CardHeader>

	<CardContent>
		<ol class="grid gap-5 ps-5 text-sm">
			<li class="marker:text-primary marker:font-bold">
				<h3 class="font-semibold">Crear el proyecto</h3>
				<p class="text-muted-foreground">
					En
					<a class="underline underline-offset-4" href="https://supabase.com/dashboard" rel="noreferrer noopener" target="_blank">
						supabase.com/dashboard
					</a>
					creá un proyecto nuevo.
				</p>
			</li>
			<li class="marker:text-primary marker:font-bold">
				<h3 class="font-semibold">Crear las tablas</h3>
				<p class="text-muted-foreground">
					En <strong>SQL Editor → New query</strong>, pegá y ejecutá
					<code class="bg-muted rounded px-1 py-0.5 text-xs">supabase/schema.sql</code>, y después
					<code class="bg-muted rounded px-1 py-0.5 text-xs">supabase/seed.sql</code>.
				</p>
			</li>
			<li class="marker:text-primary marker:font-bold">
				<h3 class="font-semibold">Copiar las credenciales</h3>
				<p class="text-muted-foreground">
					En <strong>Settings → API</strong> copiá la Project URL y la publishable key al archivo
					<code class="bg-muted rounded px-1 py-0.5 text-xs">.env</code>:
				</p>
				<pre class="bg-muted mt-2 overflow-x-auto rounded-md p-3 text-xs"><code>PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...</code></pre>
			</li>
			<li class="marker:text-primary marker:font-bold">
				<h3 class="font-semibold">Reiniciar el servidor</h3>
				<p class="text-muted-foreground">
					Cortá <code class="bg-muted rounded px-1 py-0.5 text-xs">pnpm dev</code> y volvé a levantarlo.
				</p>
			</li>
		</ol>
	</CardContent>
</Card>
