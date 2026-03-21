import { CategoriaPropiedadModel } from '../models/categoriaPropiedad.js';

export const categoriasController = {
	obtenerTodas: async (req, res) => {
		try {
			const categorias = await CategoriaPropiedadModel.obtenerTodas();
			res.json(categorias);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: 'Error al obtener categorías' });
		}
	},

	obtenerPorId: async (req, res) => {
		try {
			const categoria = await CategoriaPropiedadModel.obtenerPorId({ id: Number(req.params.id) });
			if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
			res.json(categoria);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: 'Error interno del servidor' });
		}
	},

	crear: async (req, res) => {
		try {
			const nueva = await CategoriaPropiedadModel.crear({ datos: req.body });
			res.status(201).json(nueva);
		} catch (error) {
			console.error(error);
			if (error.message.includes('UQ_CAT_NOMBRE')) {
				return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre.' });
			}
			res.status(500).json({ mensaje: 'Error al crear la categoría' });
		}
	},

	actualizar: async (req, res) => {
		try {
			const actualizada = await CategoriaPropiedadModel.actualizar({
				id: Number(req.params.id),
				datos: req.body,
			});
			if (!actualizada) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
			res.json(actualizada);
		} catch (error) {
			console.error(error);
			res.status(500).json({ mensaje: 'Error al actualizar categoría' });
		}
	},

	eliminar: async (req, res) => {
		try {
			const eliminado = await CategoriaPropiedadModel.eliminar({ id: Number(req.params.id) });
			if (!eliminado) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
			res.json({ mensaje: 'Categoría eliminada correctamente' });
		} catch (error) {
			console.error(error);
			// Si hay propiedades usando esta categoría, Oracle bloquea el borrado
			if (error.message.includes('ORA-02292')) {
				return res
					.status(400)
					.json({
						mensaje:
							'No puedes borrar esta categoría porque ya hay propiedades que la están usando.',
					});
			}
			res.status(500).json({ mensaje: 'Error al eliminar categoría' });
		}
	},
};
