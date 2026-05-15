import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ejecutarConsulta } from '../services/reportes.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const obtenerSQL = (archivo) => {
	return fs.readFileSync(
		path.join(__dirname, '../sql/reportes', archivo),

		'utf8',
	);
};

const manejarReporte = async (res, archivoSQL, mensajeError) => {
	try {
		const sql = obtenerSQL(archivoSQL);

		const data = await ejecutarConsulta(sql);

		res.json({
			ok: true,
			data,
		});
	} catch (error) {
		console.error(mensajeError, error);

		res.status(500).json({
			ok: false,
			message: mensajeError,
			error: error.message,
		});
	}
};

export const reportePagos = async (req, res) => {
	await manejarReporte(res, 'pagos.sql', 'Error obteniendo reporte de pagos');
};

export const reporteMoras = async (req, res) => {
	await manejarReporte(res, 'moras.sql', 'Error obteniendo reporte de moras');
};

export const reporteReservas = async (req, res) => {
	await manejarReporte(res, 'reservas.sql', 'Error obteniendo reporte de reservas');
};

export const reporteMultas = async (req, res) => {
	await manejarReporte(res, 'multas.sql', 'Error obteniendo reporte de multas');
};
