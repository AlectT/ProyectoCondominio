import instancia from './axios.js';

export const categoriasApi = {
	obtenerTodas: () => instancia.get('/categorias-propiedad'),
	crear: (datos) => instancia.post('/categorias-propiedad', datos),
	actualizar: (id, datos) => instancia.patch(`/categorias-propiedad/${id}`, datos),
	eliminar: (id) => instancia.delete(`/categorias-propiedad/${id}`),
};
