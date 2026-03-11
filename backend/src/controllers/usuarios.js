import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../models/usuario.js';
import { validarUsuario, validarUsuarioParcial, validarLogin } from '../schemas/usuarios.js';
import { SECRET_JWT_KEY, SALT_ROUND } from '../config/config.js';

export class UsuarioController {
	static async obtenerTodos(req, res) {
		const usuarios = await UsuarioModel.obtenerTodos();
		res.json(usuarios);
	}

	static async obtenerPorId(req, res) {
		const { id } = req.params;

		// Residente solo puede verse a sí mismo (RN-U3)
		if (req.usuario.ROL === 'Residente' && req.usuario.ID_USUARIO !== Number(id)) {
			return res.status(403).json({ mensaje: 'No tienes permiso para ver este usuario.' });
		}

		const usuario = await UsuarioModel.obtenerPorId({ id });
		if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

		const { CONTRASENA_HASH, ...usuarioSinContrasena } = usuario;
		res.json(usuarioSinContrasena);
	}

	static async crear(req, res) {
		const resultado = validarUsuario(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		// Verificar nombre de usuario único
		const existeNombreUsuario = await UsuarioModel.obtenerPorNombreUsuario({
			nombreUsuario: resultado.data.nombreUsuario,
		});
		if (existeNombreUsuario) {
			return res.status(409).json({ mensaje: 'El nombre de usuario ya está en uso.' });
		}

		// Verificar correo único
		const existeCorreo = await UsuarioModel.obtenerPorCorreo({ correo: resultado.data.correo });
		if (existeCorreo) {
			return res.status(409).json({ mensaje: 'El correo ya está registrado.' });
		}

		const contrasenaHash = await bcrypt.hash(resultado.data.contrasena, Number(SALT_ROUND));

		const nuevoUsuario = await UsuarioModel.crear({
			datos: { ...resultado.data, contrasenaHash },
		});

		const { CONTRASENA_HASH, ...usuarioSinContrasena } = nuevoUsuario;
		res.status(201).json(usuarioSinContrasena);
	}

	static async actualizar(req, res) {
		const resultado = validarUsuarioParcial(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const { id } = req.params;
		let datos = resultado.data;

		// Si viene nueva contraseña la hasheamos
		if (datos.contrasena) {
			const contrasenaHash = await bcrypt.hash(datos.contrasena, Number(SALT_ROUND));
			const { contrasena, ...restosDatos } = datos;
			datos = { ...restosDatos, contrasenaHash };
		}

		const usuarioActualizado = await UsuarioModel.actualizar({ id, datos });
		if (!usuarioActualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

		const { CONTRASENA_HASH, ...usuarioSinContrasena } = usuarioActualizado;
		return res.json(usuarioSinContrasena);
	}

	static async desactivar(req, res) {
		const { id } = req.params;
		const usuario = await UsuarioModel.obtenerPorId({ id });
		if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

		const usuarioActualizado = await UsuarioModel.actualizar({ id, datos: { activo: 0 } });
		const { CONTRASENA_HASH, ...usuarioSinContrasena } = usuarioActualizado;
		return res.json(usuarioSinContrasena);
	}

	static async login(req, res) {
		const resultado = validarLogin(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const { nombreUsuario, contrasena } = resultado.data;
		const usuario = await UsuarioModel.obtenerPorNombreUsuario({ nombreUsuario });

		if (!usuario) {
			return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos.' });
		}

		if (!usuario.ACTIVO) {
			return res.status(403).json({ mensaje: 'Usuario inactivo. Contacte al administrador.' });
		}

		const contrasenaValida = await bcrypt.compare(contrasena, usuario.CONTRASENA_HASH);
		if (!contrasenaValida) {
			return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos.' });
		}

		const token = jwt.sign({ id: usuario.ID_USUARIO, rol: usuario.ROL }, SECRET_JWT_KEY, {
			expiresIn: '8h',
		});

		res.cookie('token_sesion', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 8 * 60 * 60 * 1000,
		});

		const { CONTRASENA_HASH, ...usuarioSinContrasena } = usuario;
		res.json(usuarioSinContrasena);
	}

	static async logout(req, res) {
		res.clearCookie('token_sesion');
		res.json({ mensaje: 'Sesión cerrada correctamente.' });
	}
}
