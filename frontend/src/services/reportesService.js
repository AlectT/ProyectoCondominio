const API = 'http://localhost:1000/api/reportes';

export const obtenerPagos = async () => {
	const response = await fetch(`${API}/pagos`);
	return await response.json();
};

export const obtenerMoras = async () => {
	const response = await fetch(`${API}/moras`);
	return await response.json();
};

export const obtenerReservas = async () => {
	const response = await fetch(`${API}/reservas`);
	return await response.json();
};

export const obtenerMultas = async () => {
	const response = await fetch(`${API}/multas`);
	return await response.json();
};
