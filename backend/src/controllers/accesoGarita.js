import { AccesoGaritaModel } from '../models/accesoGarita.js';
import { validarAccesoGarita, validarAccesoGaritaParcial } from '../schemas/accesoGarita.js';

export class AccesoGaritaController {
	static async obtenerTodos(req, res) {
		const invitaciones = await AccesoGaritaModel.obtenerTodos();
		res.json(invitaciones);
	}

	static async obtenerPorId(req, res) {
		const { id } = req.params;
		const invitacion = await AccesoGaritaModel.obtenerPorId({ id: id });
		if (invitacion) return res.json(invitacion);
		res.status(404).json({ mensaje: 'Invitacion no encontrada.' });
	}

	static async crear(req, res) {
		const resultado = validarAccesoGarita(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const nuevoAcceso = await AccesoGaritaModel.crear({
			datos: { ...resultado.data },
		});
		res.status(201).json(nuevoAcceso);
	}

	static async actualizar(req, res) {
		const resultado = validarAccesoGaritaParcial(req.body);
		if (!resultado.success) {
			return res.status(400).json({ error: JSON.parse(resultado.error.message) });
		}

		const { id } = req.params;
		const accesoActualizado = await AccesoGaritaModel.actualizar({
			id,
			datos: resultado.data,
		});

		if (!accesoActualizado) return res.status(404).json({ mensaje: 'Acceso no encontrado.' });
		return res.json(accesoActualizado);
	}

	static async eliminar(req, res) {
		const { id } = req.params;
		const resultado = await AccesoGaritaModel.eliminar({ id });

		if (!resultado) return res.status(404).json({ mensaje: 'Acceso no encontrado.' });
		return res.json({ mensaje: 'Acceso eliminado.' });
	}
}
