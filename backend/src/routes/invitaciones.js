// ============================================================
// 📁 RUTA: backend/src/routes/invitaciones.js
// ============================================================

import { Router } from 'express';
import { InvitacionController } from '../controllers/invitaciones.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorInvitaciones = Router();

// Todas las rutas requieren estar autenticado
enrutadorInvitaciones.use(autenticacion);

// ⚠️ Esta ruta DEBE ir ANTES de /:id para que Express no interprete
//    "validar" como un id numérico
// GET /invitaciones/validar/:codigo → garita escanea QR (RN-I4)
enrutadorInvitaciones.get(
	'/validar/:codigo',
	verificarRol('Administrador', 'Guardia'),
	InvitacionController.validarQR,
);

// GET /invitaciones → listar todas
enrutadorInvitaciones.get(
	'/',
	verificarRol('Administrador', 'Guardia', 'Residente'),
	InvitacionController.obtenerTodas,
);

// GET /invitaciones/:id → obtener una por id
enrutadorInvitaciones.get(
	'/:id',
	verificarRol('Administrador', 'Guardia', 'Residente'),
	InvitacionController.obtenerPorId,
);

// POST /invitaciones → crear nueva (RN-I1: usuarios pueden generar invitaciones)
enrutadorInvitaciones.post(
	'/',
	verificarRol('Administrador', 'Guardia', 'Residente'),
	InvitacionController.crear,
);

// PATCH /invitaciones/:id → editar nombre visitante o propiedad
enrutadorInvitaciones.patch(
	'/:id',
	verificarRol('Administrador', 'Guardia'),
	InvitacionController.actualizar,
);

// PATCH /invitaciones/:id/desactivar → invalidar QR manualmente (RN-I5 Servicio)
enrutadorInvitaciones.patch(
	'/:id/desactivar',
	verificarRol('Administrador', 'Guardia'),
	InvitacionController.desactivar,
);

// DELETE /invitaciones/:id → eliminar registro
enrutadorInvitaciones.delete(
	'/:id',
	verificarRol('Administrador'),
	InvitacionController.eliminar,
);
