import { Router } from 'express';
import { ParqueoController } from '../controllers/parqueos.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorParqueos = Router();

// Todas las rutas requieren estar autenticado
enrutadorParqueos.use(autenticacion);

enrutadorParqueos.get(
	'/',
	verificarRol('Administrador', 'Guardia', 'Colaborador'),
	ParqueoController.obtenerTodos,
);
enrutadorParqueos.post('/', verificarRol('Administrador'), ParqueoController.crear);
enrutadorParqueos.get(
	'/:id',
	verificarRol('Administrador', 'Guardia', 'Colaborador'),
	ParqueoController.obtenerPorId,
);
enrutadorParqueos.put('/:id', verificarRol('Administrador'), ParqueoController.actualizar);
enrutadorParqueos.delete('/:id', verificarRol('Administrador'), ParqueoController.eliminar);
