import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

export const ejecutarConsulta = async (query, binds = {}) => {
	let connection;

	try {
		connection = await conectar();

		const result = await connection.execute(query, binds, {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});

		return result.rows;
	} catch (error) {
		console.error('Error ejecutando consulta reporte:', error);

		throw error;
	} finally {
		if (connection) {
			try {
				await connection.close();
			} catch (error) {
				console.error('Error cerrando conexión:', error);
			}
		}
	}
};
