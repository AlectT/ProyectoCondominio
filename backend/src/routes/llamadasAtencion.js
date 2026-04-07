import { Router } from 'express';
import { LlamadasAtencionController } from '../controllers/llamadasAtencion.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorLlamadasAtencion = Router();

// Todas las rutas requieren estar autenticado
enrutadorLlamadasAtencion.use(autenticacion);

// Solo el administrador puede crear, actualizar y eliminar tickets
enrutadorLlamadasAtencion.get(
	'/',
	verificarRol('Administrador', 'Guardia', 'Residente'),
	LlamadasAtencionController.obtenerTodos,
);
enrutadorLlamadasAtencion.post(
	'/',
	verificarRol('Administrador', 'Guardia'),
	LlamadasAtencionController.crear,
);

enrutadorLlamadasAtencion.get(
	'/agrupados',
	verificarRol('Administrador', 'Guardia', 'Residente'),
	LlamadasAtencionController.agrupados,
);

enrutadorLlamadasAtencion.get(
	'/agrupados/:id',
	verificarRol('Administrador', 'Guardia', 'Residente'),
	LlamadasAtencionController.obtenerPorIdAgrupados,
);

enrutadorLlamadasAtencion.get(
	'/:id',
	verificarRol('Administrador', 'Guardia', 'Residente'),
	LlamadasAtencionController.obtenerPorId,
);

enrutadorLlamadasAtencion.put(
	'/:id',
	verificarRol('Administrador', 'Guardia'),
	LlamadasAtencionController.actualizar,
);
enrutadorLlamadasAtencion.delete(
	'/:id',
	verificarRol('Administrador', 'Guardia'),
	LlamadasAtencionController.eliminar,
);
