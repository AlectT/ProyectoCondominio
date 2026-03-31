// ============================================================
// 📁 RUTA: backend/src/routes/accesoGarita.js
// ============================================================

import { Router } from 'express';
import { AccesoGaritaController } from '../controllers/accesoGarita.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorAccesoGarita = Router();

// ── RUTAS PÚBLICAS ────────────────────────────────────────────
// El celular del guardia/visitante (si usa la vista externa) no tiene sesión,
// por lo que no puede requerir login para validar o registrar.

// GET /accesoGarita/validar/:qr -> Para leer el código
enrutadorAccesoGarita.get('/validar/:qr', AccesoGaritaController.validarQr);

// POST /accesoGarita/registrar -> Para guardar el registro de ingreso en la bitácora
enrutadorAccesoGarita.post('/registrar', AccesoGaritaController.crear);

// ── RUTAS PROTEGIDAS ──────────────────────────────────────────
// Todo lo que esté debajo de esta línea REQUIERE token de sesión (estar logueado)
enrutadorAccesoGarita.use(autenticacion);

enrutadorAccesoGarita.get(
	'/',
	verificarRol('Administrador', 'Guardia'),
	AccesoGaritaController.obtenerTodos,
);

enrutadorAccesoGarita.get(
	'/:id',
	verificarRol('Administrador', 'Guardia'),
	AccesoGaritaController.obtenerPorId,
);

enrutadorAccesoGarita.put(
	'/:id',
	verificarRol('Administrador'),
	AccesoGaritaController.actualizar,
);

enrutadorAccesoGarita.delete(
	'/:id',
	verificarRol('Administrador'),
	AccesoGaritaController.eliminar,
);
