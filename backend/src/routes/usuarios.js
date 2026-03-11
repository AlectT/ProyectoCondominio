import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarios.js';
import { autenticacion } from '../middlewares/autenticacion.js';
import { verificarRol } from '../middlewares/permisos.js';

export const enrutadorUsuarios = Router();

// Rutas públicas
enrutadorUsuarios.post('/login', UsuarioController.login);
enrutadorUsuarios.post('/logout', UsuarioController.logout);

// Rutas protegidas
enrutadorUsuarios.get(
	'/',
	autenticacion,
	verificarRol('Administrador'),
	UsuarioController.obtenerTodos,
);
enrutadorUsuarios.get(
	'/:id',
	autenticacion,
	verificarRol('Administrador', 'Residente'),
	UsuarioController.obtenerPorId,
);
enrutadorUsuarios.post(
	'/',
	autenticacion,
	verificarRol('Administrador'),
	UsuarioController.crear,
);
enrutadorUsuarios.patch(
	'/:id',
	autenticacion,
	verificarRol('Administrador'),
	UsuarioController.actualizar,
);
enrutadorUsuarios.patch(
	'/:id/desactivar',
	autenticacion,
	verificarRol('Administrador'),
	UsuarioController.desactivar,
);
