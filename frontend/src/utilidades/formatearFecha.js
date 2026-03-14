/**
 * Formatea una fecha ISO o string de Oracle a dd/mm/yyyy
 * @param {string} fecha
 * @returns {string}
 */
export function formatearFecha(fecha) {
	if (!fecha) return '—';
	const d = new Date(fecha);
	if (isNaN(d)) return fecha;
	return d.toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
