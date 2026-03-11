import 'dotenv/config';
import { conectar } from '../config/db.js';

async function probarConexion() {
	let conexion;
	try {
		console.log('Probando conexión a Oracle DB...');
		conexion = await conectar();

		const resultado = await conexion.execute('SELECT 1 FROM DUAL');

		if (resultado.rows.length > 0) {
			console.log('Conexión exitosa.');
		}
	} catch (error) {
		console.error('Conexión fallida:', error.message);
		process.exit(1);
	} finally {
		if (conexion) await conexion.close();
	}
}

probarConexion();
