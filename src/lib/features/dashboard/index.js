/** API pública de la feature del panel. */
export { default as AlertsCard } from './components/AlertsCard.svelte';
export { default as StatsGrid } from './components/StatsGrid.svelte';
export { default as DashboardSkeleton } from './components/DashboardSkeleton.svelte';
export { buildAlerts } from './domain/alerts.js';
export { loadSummary, summary } from './state/summary.svelte.js';
