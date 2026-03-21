import instancia from './axios';

export const accesoGaritaApi = {
	obtenerTodos: () => instancia.get('/accesoGarita'),

	obtenerPorId: (id) => instancia.get(`/accesoGarita/${id}`),

	crear: (datos) => instancia.post('/accesoGarita', datos),

	actualizar: (id, datos) => instancia.patch(`/accesoGarita/${id}`, datos),

	eliminar: (id) => instancia.delete(`/accesoGarita/${id}`),
};
