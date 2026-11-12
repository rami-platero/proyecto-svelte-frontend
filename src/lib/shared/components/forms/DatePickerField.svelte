<script>
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { Button } from '#lib/shared/components/ui/button/index.js';
	import { Calendar } from '#lib/shared/components/ui/calendar/index.js';
	import { Popover, PopoverContent, PopoverTrigger } from '#lib/shared/components/ui/popover/index.js';
	import { fromCalendarDate, toCalendarDate } from '#lib/shared/utils/dates.js';
	import { formatDate } from '#lib/shared/utils/format.js';

	/**
	 * Selector de fecha con el Calendar de shadcn-svelte. El valor que entra y
	 * sale es un string ISO (`YYYY-MM-DD`), que es lo que esperan las columnas
	 * `date` de Postgres; la conversión a `CalendarDate` queda encapsulada acá.
	 *
	 * @type {{
	 *   value?: string | null,
	 *   id?: string,
	 *   describedBy?: string,
	 *   invalid?: boolean,
	 *   placeholder?: string
	 * }}
	 */
	let {
		value = $bindable(''),
		id = undefined,
		describedBy = undefined,
		invalid = false,
		placeholder = 'Elegí una fecha'
	} = $props();

	let open = $state(false);

	const calendarValue = $derived(toCalendarDate(value));
	const label = $derived(value ? formatDate(value) : placeholder);

	/** @param {import('@internationalized/date').DateValue | undefined} date */
	function handleSelect(date) {
		value = fromCalendarDate(/** @type {any} */ (date));
		open = false;
	}
</script>

<Popover bind:open>
	<PopoverTrigger>
		{#snippet child(/** @type {{ props: Record<string, any> }} */ { props })}
			<Button
				{...props}
				{id}
				variant="outline"
				aria-invalid={invalid}
				aria-describedby={describedBy}
				class="w-full justify-start font-normal {value ? '' : 'text-muted-foreground'}"
			>
				<CalendarIcon />
				{label}
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent class="w-auto p-0" align="start">
		<Calendar type="single" value={calendarValue} onValueChange={handleSelect} />
	</PopoverContent>
</Popover>
