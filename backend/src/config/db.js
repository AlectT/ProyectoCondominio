import oracledb from 'oracledb';
import { DB_USER, DB_PASSWORD, DB_CONNECTION_STRING } from './config.js';

const configuracionDB = {
	user: DB_USER,
	password: DB_PASSWORD,
	connectString: DB_CONNECTION_STRING,
};

export async function conectar() {
	try {
		const conexion = await oracledb.getConnection(configuracionDB);
		return conexion;
	} catch (error) {
		console.error('Error al conectar con Oracle DB:', error);
		throw error;
	}
}
