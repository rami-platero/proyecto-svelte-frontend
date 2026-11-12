<script>
	import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
	import CalendarMonthSelect from "./calendar-month-select.svelte";
	import CalendarYearSelect from "./calendar-year-select.svelte";
	let {
		captionLayout = undefined,
		months = undefined,
		monthFormat = undefined,
		years = undefined,
		yearFormat = undefined,
		month = undefined,
		locale = undefined,
		placeholder = $bindable(),
		monthIndex = 0,
	} = $props();

	/** @param {import("@internationalized/date").DateValue} date */
	function formatYear(date) {
		const dateObj = date.toDate(getLocalTimeZone());
		if (typeof yearFormat === "function") return yearFormat(dateObj.getFullYear());
		return new DateFormatter(locale, { year: yearFormat }).format(dateObj);
	}

	/** @param {import("@internationalized/date").DateValue} date */
	function formatMonth(date) {
		const dateObj = date.toDate(getLocalTimeZone());
		if (typeof monthFormat === "function") return monthFormat(dateObj.getMonth() + 1);
		return new DateFormatter(locale, { month: monthFormat }).format(dateObj);
	}
</script>

{#snippet MonthSelect()}
	<CalendarMonthSelect
		{months}
		{monthFormat}
		value={month.month}
		onchange={(/** @type {Event & { currentTarget: HTMLSelectElement }} */ e) => {
			if (!placeholder) return;
			const v = Number.parseInt(e.currentTarget.value);
			const newPlaceholder = placeholder.set({ month: v });
			placeholder = newPlaceholder.subtract({ months: monthIndex });
		}}
	/>
{/snippet}

{#snippet YearSelect()}
	<CalendarYearSelect {years} {yearFormat} value={month.year} />
{/snippet}

{#if captionLayout === "dropdown"}
	{@render MonthSelect()}
	{@render YearSelect()}
{:else if captionLayout === "dropdown-months"}
	{@render MonthSelect()}
	{#if placeholder}
		{formatYear(placeholder)}
	{/if}
{:else if captionLayout === "dropdown-years"}
	{#if placeholder}
		{formatMonth(placeholder)}
	{/if}
	{@render YearSelect()}
{:else}
	{formatMonth(month)} {formatYear(month)}
{/if}