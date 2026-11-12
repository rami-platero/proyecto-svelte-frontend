export const MOVEMENT_TYPES = [
	{ value: 'inbound', label: 'Entrada', help: 'Suma unidades al stock' },
	{ value: 'outbound', label: 'Salida', help: 'Resta unidades del stock' },
	{ value: 'adjustment', label: 'Ajuste', help: 'Fija el stock en un valor exacto' }
];

/** Ventana máxima de historial que se mira para estimar el ritmo de venta. */
export const SALES_WINDOW_DAYS = 90;
export const SALES_MIN_EVENTS = 3;
export const SALES_MIN_WINDOW_DAYS = 7;

export const CONFIDENCE_LABELS = {
	none: 'sin datos suficientes',
	low: 'confianza baja',
	medium: 'confianza media',
	high: 'confianza alta'
};
