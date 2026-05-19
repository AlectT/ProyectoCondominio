export function generarNumeroBoleta() {
	return `BOL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}
