import instancia from './axios.js';

export const propiedadesApi = {
	obtenerTodas: () => instancia.get('/propiedades'),
	crear: (datos) => instancia.post('/propiedades', datos),
	actualizar: (id, datos) => instancia.patch(`/propiedades/${id}`, datos), // 🔥 DEBE SER PATCH
	eliminar: (id) => instancia.delete(`/propiedades/${id}`),
};
