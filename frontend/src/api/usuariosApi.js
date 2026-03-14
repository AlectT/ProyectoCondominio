import instancia from './axios.js';

export const usuariosApi = {
	login: (datos) => instancia.post('/usuarios/login', datos),

	logout: () => instancia.post('/usuarios/logout'),

	obtenerTodos: () => instancia.get('/usuarios'),

	obtenerPorId: (id) => instancia.get(`/usuarios/${id}`),

	crear: (datos) => instancia.post('/usuarios', datos),

	actualizar: (id, datos) => instancia.patch(`/usuarios/${id}`, datos),

	desactivar: (id) => instancia.patch(`/usuarios/${id}/desactivar`),
};
