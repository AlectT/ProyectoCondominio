// ============================================================
// 📁 RUTA: backend/src/controllers/invitaciones.js
// ============================================================

import { InvitacionModel } from '../models/invitacion.js';

// Mapeo de texto → ID en tabla TIPO_INVITACION
const MAPA_TIPO = {
	Normal: 1,
	Servicio: 2,
};

export class InvitacionController {
	// GET /invitaciones
	static async obtenerTodas(req, res) {
		try {
			// Expira las vencidas antes de retornar (RN-I3)
			await InvitacionModel.expirarVencidas();
			const invitaciones = await InvitacionModel.obtenerTodas();
			res.json(invitaciones);
		} catch (error) {
			console.error('Error al obtener invitaciones:', error);
			res.status(500).json({ mensaje: 'Error al obtener las invitaciones' });
		}
	}

	// GET /invitaciones/:id
	static async obtenerPorId(req, res) {
		try {
			const invitacion = await InvitacionModel.obtenerPorId({
				id: Number(req.params.id),
			});
			if (!invitacion) {
				return res.status(404).json({ mensaje: 'Invitación no encontrada' });
			}
			res.json(invitacion);
		} catch (error) {
			console.error('Error al obtener invitación:', error);
			res.status(500).json({ mensaje: 'Error al obtener la invitación' });
		}
	}

	// POST /invitaciones
	static async crear(req, res) {
		try {
			const { nombreVisitante, tipo, idUsuario } = req.body;

			// Validaciones
			if (!nombreVisitante || !tipo || !idUsuario) {
				return res.status(400).json({
					mensaje: 'Faltan campos: nombreVisitante, tipo, idUsuario',
				});
			}

			if (!['Normal', 'Servicio'].includes(tipo)) {
				return res.status(400).json({
					mensaje: 'El tipo debe ser Normal o Servicio',
				});
			}

			// Convertir texto a ID de tabla TIPO_INVITACION
			const idTipo = MAPA_TIPO[tipo];

			const nueva = await InvitacionModel.crear({
				datos: { nombreVisitante, idTipo, idUsuario },
			});

			res.status(201).json(nueva);
		} catch (error) {
			console.error('Error al crear invitación:', error);
			res.status(500).json({ mensaje: 'Error al crear la invitación' });
		}
	}

	// PATCH /invitaciones/:id
	static async actualizar(req, res) {
		try {
			const actualizada = await InvitacionModel.actualizar({
				id: Number(req.params.id),
				datos: req.body,
			});
			if (!actualizada) {
				return res.status(404).json({ mensaje: 'Invitación no encontrada' });
			}
			res.json(actualizada);
		} catch (error) {
			console.error('Error al actualizar invitación:', error);
			res.status(500).json({ mensaje: 'Error al actualizar la invitación' });
		}
	}

	// DELETE /invitaciones/:id
	static async eliminar(req, res) {
		try {
			const eliminado = await InvitacionModel.eliminar({
				id: Number(req.params.id),
			});
			if (!eliminado) {
				return res.status(404).json({ mensaje: 'Invitación no encontrada' });
			}
			res.json({ mensaje: 'Invitación eliminada correctamente' });
		} catch (error) {
			console.error('Error al eliminar invitación:', error);
			res.status(500).json({ mensaje: 'Error al eliminar la invitación' });
		}
	}

	// PATCH /invitaciones/:id/desactivar   (RN-I5 Servicio)
	static async desactivar(req, res) {
		try {
			const actualizada = await InvitacionModel.desactivar({
				id: Number(req.params.id),
			});
			if (!actualizada) {
				return res.status(404).json({ mensaje: 'Invitación no encontrada' });
			}
			res.json(actualizada);
		} catch (error) {
			console.error('Error al desactivar invitación:', error);
			res.status(500).json({ mensaje: 'Error al desactivar la invitación' });
		}
	}

	// GET /invitaciones/validar/:codigo    (RN-I4 garita)
	static async validarQR(req, res) {
		try {
			const invitacion = await InvitacionModel.validarQR({
				codigoQR: req.params.codigo,
			});
			if (!invitacion) {
				return res.status(404).json({ mensaje: 'Código QR no encontrado' });
			}
			res.json(invitacion);
		} catch (error) {
			console.error('Error al validar QR:', error);
			res.status(500).json({ mensaje: 'Error al validar el código QR' });
		}
	}
}
