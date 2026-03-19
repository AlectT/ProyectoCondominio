import { Router } from 'express';
import { AccesoGaritaController } from '../controllers/accesoGarita.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorAccesoGarita = Router();

// Todas las rutas requieren estar autenticado
enrutadorAccesoGarita.use(autenticacion);

// Solo el administrador puede crear, actualizar y eliminar tickets
enrutadorAccesoGarita.get(
	'/',
	verificarRol('Administrador', 'Guardia'),
	AccesoGaritaController.obtenerTodos,
);
enrutadorAccesoGarita.post('/', verificarRol('Administrador'), AccesoGaritaController.crear);

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
