/** API pública de la feature de vencimientos. */
export { default as ExpiryBadge } from './components/ExpiryBadge.svelte';
export { default as ExpiryList } from './components/ExpiryList.svelte';
export { default as ExpiryStats } from './components/ExpiryStats.svelte';
export { default as DiscardBatchDialog } from './components/DiscardBatchDialog.svelte';
export { default as ExpiryListSkeleton } from './components/ExpiryListSkeleton.svelte';

export { batches, loadBatchesOf, loadExpiringBatches } from './state/batches.svelte.js';
export { daysUntil, describeDays, getExpiryStatus, needsAttention } from './domain/expiry.js';
export { promoAdvice } from './domain/promo.js';
export { EXPIRY_WARNING_DAYS } from './domain/constants.js';
