import instancia from './axios.js';

export const vinculacionesApi = {
	obtenerTodas: () => instancia.get('/vinculaciones'),
	crear: (datos) => instancia.post('/vinculaciones', datos),
	actualizar: (id, datos) => instancia.patch(`/vinculaciones/${id}`, datos),
	eliminar: (id) => instancia.delete(`/vinculaciones/${id}`),
};
