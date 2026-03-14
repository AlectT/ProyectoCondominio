import instancia from './axios.js';

export const ticketsApi = {
	obtenerTodos: (filtros = {}) => instancia.get('/tickets', { params: filtros }),

	obtenerPorId: (id) => instancia.get(`/tickets/${id}`),

	obtenerHistorial: (id) => instancia.get(`/tickets/${id}/historial`),

	crear: (datos) => instancia.post('/tickets', datos),

	actualizar: (id, datos) => instancia.patch(`/tickets/${id}`, datos),

	eliminar: (id) => instancia.delete(`/tickets/${id}`),
};
