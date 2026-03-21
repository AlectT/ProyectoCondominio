import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

export class UsuarioPropiedadModel {
	static async obtenerTodas() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT 
                    up.ID_USUARIO_PROPIEDAD, 
                    up.ID_USUARIO, 
                    u.NOMBRE || ' ' || u.APELLIDO AS USUARIO_NOMBRE,
                    up.ID_PROPIEDAD, 
                    p.NUMERO_PROPIEDAD AS PROPIEDAD_NUMERO,
                    up.TIPO_VINCULO, 
                    up.FECHA_INICIO, 
                    up.FECHA_FIN, 
                    up.ACTIVO
                 FROM USUARIO_PROPIEDAD up
                 JOIN USUARIO u ON up.ID_USUARIO = u.ID_USUARIO
                 JOIN PROPIEDAD p ON up.ID_PROPIEDAD = p.ID_PROPIEDAD
                 ORDER BY p.NUMERO_PROPIEDAD, up.TIPO_VINCULO`,
				{},
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorId({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT * FROM USUARIO_PROPIEDAD WHERE ID_USUARIO_PROPIEDAD = :id`,
				{ id },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows[0] ?? null;
		} finally {
			await conexion.close();
		}
	}

	static async crear({ datos }) {
		const conexion = await conectar();
		try {
			const { idUsuario, idPropiedad, tipoVinculo, activo = 1 } = datos;
			const resultado = await conexion.execute(
				`INSERT INTO USUARIO_PROPIEDAD (ID_USUARIO, ID_PROPIEDAD, TIPO_VINCULO, ACTIVO) 
                 VALUES (:idUsuario, :idPropiedad, :tipoVinculo, :activo) 
                 RETURNING ID_USUARIO_PROPIEDAD INTO :idUp`,
				{
					idUsuario: Number(idUsuario),
					idPropiedad: Number(idPropiedad),
					tipoVinculo,
					activo,
					idUp: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);
			return this.obtenerPorId({ id: resultado.outBinds.idUp[0] });
		} finally {
			await conexion.close();
		}
	}

	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			// Permitimos cambiar el usuario o inactivar el vínculo
			const campos = {
				idUsuario: 'ID_USUARIO',
				tipoVinculo: 'TIPO_VINCULO',
				activo: 'ACTIVO',
			};

			const setCampos = [];
			const parametros = { id };

			for (const [key, columna] of Object.entries(campos)) {
				if (datos[key] !== undefined) {
					setCampos.push(`${columna} = :${key}`);
					parametros[key] = key === 'idUsuario' ? Number(datos[key]) : datos[key];
				}
			}

			if (setCampos.length === 0) return null;

			await conexion.execute(
				`UPDATE USUARIO_PROPIEDAD SET ${setCampos.join(', ')} WHERE ID_USUARIO_PROPIEDAD = :id`,
				parametros,
				{ autoCommit: true },
			);
			return this.obtenerPorId({ id });
		} finally {
			await conexion.close();
		}
	}

	static async eliminar({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				'DELETE FROM USUARIO_PROPIEDAD WHERE ID_USUARIO_PROPIEDAD = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}
}
