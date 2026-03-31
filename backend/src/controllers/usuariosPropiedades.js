import { UsuarioPropiedadModel } from '../models/usuarioPropiedad.js';

export const vinculacionesController = {
	obtenerTodas: async (req, res) => {
		try {
			const vinculaciones = await UsuarioPropiedadModel.obtenerTodas();
			res.json(vinculaciones);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: 'Error al obtener vinculaciones' });
		}
	},

	crear: async (req, res) => {
		try {
			const nueva = await UsuarioPropiedadModel.crear({ datos: req.body });
			res.status(201).json(nueva);
		} catch (error) {
			console.error(error);
			if (error.message.includes('ORA-20002')) {
				return res
					.status(400)
					.json({
						mensaje: 'La propiedad ya alcanzó el máximo de 2 usuarios (Propietario e Inquilino).',
					});
			}
			if (error.message.includes('UQ_UP_TIPO')) {
				return res
					.status(400)
					.json({
						mensaje:
							'Esta propiedad ya tiene registrado a alguien con este tipo de vínculo. Elimínalo o edítalo primero.',
					});
			}
			res.status(500).json({ mensaje: 'Error al registrar el vínculo.' });
		}
	},

	actualizar: async (req, res) => {
		try {
			const actualizada = await UsuarioPropiedadModel.actualizar({
				id: Number(req.params.id),
				datos: req.body,
			});
			if (!actualizada) return res.status(404).json({ mensaje: 'Vínculo no encontrado' });
			res.json(actualizada);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: 'Error al actualizar el vínculo' });
		}
	},

	eliminar: async (req, res) => {
		try {
			const eliminado = await UsuarioPropiedadModel.eliminar({ id: Number(req.params.id) });
			if (!eliminado) return res.status(404).json({ mensaje: 'Vínculo no encontrado' });
			res.json({ mensaje: 'Vínculo eliminado correctamente' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: 'Error al eliminar el vínculo' });
		}
	},
};
