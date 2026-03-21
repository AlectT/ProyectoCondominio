// ============================================================
// 📁 RUTA: frontend/src/api/invitacionesApi.js
// ============================================================

import instancia from './axios.js';

export const invitacionesApi = {
	// GET /invitaciones → listar todas
	obtenerTodas: () => instancia.get('/invitaciones'),

	// GET /invitaciones/:id → obtener una
	obtenerPorId: (id) => instancia.get(`/invitaciones/${id}`),

	// POST /invitaciones → crear nueva
	// body: { nombreVisitante, tipo, idPropiedad, idUsuario }
	crear: (datos) => instancia.post('/invitaciones', datos),

	// PATCH /invitaciones/:id → editar nombre visitante o propiedad
	// body: { nombreVisitante?, idPropiedad? }
	actualizar: (id, datos) => instancia.patch(`/invitaciones/${id}`, datos),

	// DELETE /invitaciones/:id → eliminar registro
	eliminar: (id) => instancia.delete(`/invitaciones/${id}`),

	// PATCH /invitaciones/:id/desactivar → invalidar QR (RN-I5 Servicio)
	desactivar: (id) => instancia.patch(`/invitaciones/${id}/desactivar`),

	// GET /invitaciones/validar/:codigo → garita escanea QR (RN-I4)
	validarQR: (codigo) => instancia.get(`/invitaciones/validar/${encodeURIComponent(codigo)}`),
};
