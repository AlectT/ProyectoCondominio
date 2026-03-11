import bcrypt from 'bcrypt';
import { conectar } from '../config/db.js';
import { SALT_ROUND } from '../config/config.js';

const usuarios = [
	{
		nombreUsuario: 'admin',
		nombre: 'Admin',
		apellido: 'Test',
		correo: 'admin@test.com',
		contrasena: 'admin',
		rol: 'Administrador',
	},
	{
		nombreUsuario: 'guardia',
		nombre: 'Guardia',
		apellido: 'Test',
		correo: 'guardia@test.com',
		contrasena: 'guardia',
		rol: 'Guardia',
	},
	{
		nombreUsuario: 'residente',
		nombre: 'Residente',
		apellido: 'Test',
		correo: 'residente@test.com',
		contrasena: 'residente',
		rol: 'Residente',
	},
	{
		nombreUsuario: 'inactivo',
		nombre: 'Inactivo',
		apellido: 'Test',
		correo: 'inactivo@test.com',
		contrasena: 'residente',
		rol: 'Residente',
		activo: 0,
	},
];

async function crearUsuarios() {
	const conexion = await conectar();
	try {
		for (const u of usuarios) {
			const contrasenaHash = await bcrypt.hash(u.contrasena, Number(SALT_ROUND));

			// Obtener id del rol
			const resultadoRol = await conexion.execute(
				'SELECT ID_ROL FROM ROL WHERE NOMBRE = :nombre',
				{ nombre: u.rol },
				{ outFormat: (await import('oracledb')).default.OUT_FORMAT_OBJECT },
			);

			const idRol = resultadoRol.rows[0]?.ID_ROL;
			if (!idRol) {
				console.error(`Rol no encontrado: ${u.rol}`);
				continue;
			}

			await conexion.execute(
				`INSERT INTO USUARIO (ID_ROL, NOMBRE_USUARIO, NOMBRE, APELLIDO, CORREO, CONTRASENA_HASH, ACTIVO)
         VALUES (:idRol, :nombreUsuario, :nombre, :apellido, :correo, :contrasenaHash, :activo)`,
				{
					idRol,
					nombreUsuario: u.nombreUsuario,
					nombre: u.nombre,
					apellido: u.apellido,
					correo: u.correo,
					contrasenaHash,
					activo: u.activo ?? 1,
				},
				{ autoCommit: true },
			);

			console.log(`Usuario creado: ${u.nombreUsuario} (${u.rol})`);
		}
	} catch (error) {
		console.error('Error en el script:', error.message);
	} finally {
		await conexion.close();
		process.exit(0);
	}
}

crearUsuarios();
