/** API pública de la feature de movimientos. */
export { default as MovementList } from './components/MovementList.svelte';
export { default as MovementForm } from './components/MovementForm.svelte';
export { default as MovementFormDialog } from './components/MovementFormDialog.svelte';
export { default as MovementFilters } from './components/MovementFilters.svelte';
export { default as MovementListSkeleton } from './components/MovementListSkeleton.svelte';

export {
	applyMovement,
	loadMovements,
	loadRecentMovements,
	movements
} from './state/movements.svelte.js';

export { salesSignal } from './domain/sales.js';
export { MOVEMENT_TYPES, CONFIDENCE_LABELS } from './domain/constants.js';
