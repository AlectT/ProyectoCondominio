import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

export class CategoriaPropiedadModel {
	static async obtenerTodas() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`SELECT ID_CATEGORIA, NOMBRE, DESCRIPCION, MAX_PARQUEOS, CUOTA_MENSUAL 
                 FROM CATEGORIA_PROPIEDAD ORDER BY ID_CATEGORIA ASC`,
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
				`SELECT ID_CATEGORIA, NOMBRE, DESCRIPCION, MAX_PARQUEOS, CUOTA_MENSUAL 
                 FROM CATEGORIA_PROPIEDAD WHERE ID_CATEGORIA = :id`,
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
			const { nombre, descripcion, maxParqueos, cuotaMensual } = datos;
			const resultado = await conexion.execute(
				`INSERT INTO CATEGORIA_PROPIEDAD (NOMBRE, DESCRIPCION, MAX_PARQUEOS, CUOTA_MENSUAL) 
                 VALUES (:nombre, :descripcion, :maxParqueos, :cuotaMensual) 
                 RETURNING ID_CATEGORIA INTO :idCategoria`,
				{
					nombre,
					descripcion: descripcion || '',
					maxParqueos: Number(maxParqueos),
					cuotaMensual: Number(cuotaMensual),
					idCategoria: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);
			const nuevoId = resultado.outBinds.idCategoria[0];
			return this.obtenerPorId({ id: nuevoId });
		} finally {
			await conexion.close();
		}
	}

	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			const campos = {
				nombre: 'NOMBRE',
				descripcion: 'DESCRIPCION',
				maxParqueos: 'MAX_PARQUEOS',
				cuotaMensual: 'CUOTA_MENSUAL',
			};

			const setCampos = [];
			const parametros = { id };

			for (const [key, columna] of Object.entries(campos)) {
				if (datos[key] !== undefined) {
					setCampos.push(`${columna} = :${key}`);
					parametros[key] =
						key === 'maxParqueos' || key === 'cuotaMensual' ? Number(datos[key]) : datos[key];
				}
			}

			if (setCampos.length === 0) return null;

			await conexion.execute(
				`UPDATE CATEGORIA_PROPIEDAD SET ${setCampos.join(', ')} WHERE ID_CATEGORIA = :id`,
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
				'DELETE FROM CATEGORIA_PROPIEDAD WHERE ID_CATEGORIA = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}
}
