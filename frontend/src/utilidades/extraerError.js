/**
 * Extrae un mensaje legible del error de axios.
 * Maneja tanto { mensaje } como { error: [...] } de Zod.
 * @param {any} err - error capturado en catch
 * @returns {string}
 */
export function extraerError(err) {
	const data = err.response?.data;
	if (!data) return 'Error al conectar con el servidor.';

	// Error de mensaje simple
	if (data.mensaje) return data.mensaje;

	// Error de validación Zod — array de objetos con message
	if (Array.isArray(data.error)) {
		return data.error.map((e) => e.message).join(', ');
	}

	return 'Error al guardar.';
}
