/** API pública de la feature de vencimientos. */
export { batches, loadBatchesOf, loadExpiringBatches } from './state/batches.svelte.js';
export { daysUntil, describeDays, getExpiryStatus, needsAttention } from './domain/expiry.js';
export { EXPIRY_WARNING_DAYS } from './domain/constants.js';
