import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

const consultaBase = `
  SELECT
    p.ID_PROPIEDAD,
    p.ID_CATEGORIA,
    c.NOMBRE AS CATEGORIA_NOMBRE,
    c.MAX_PARQUEOS,
    c.CUOTA_MENSUAL,
    p.NUMERO_PROPIEDAD,
    p.DESCRIPCION,
    p.ACTIVO,
    p.FECHA_REGISTRO
  FROM PROPIEDAD p
  JOIN CATEGORIA_PROPIEDAD c ON p.ID_CATEGORIA = c.ID_CATEGORIA
`;

export class PropiedadModel {
	static async obtenerTodas() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase,
				{},
				{
					outFormat: oracledb.OUT_FORMAT_OBJECT,
				},
			);
			return resultado.rows;
		} catch (error) {
			console.error('Error al obtener todas las propiedades:', error);
			throw error;
		} finally {
			await conexion.close();
		}
	}

	static async obtenerPorId({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' WHERE p.ID_PROPIEDAD = :id',
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
			const { idCategoria, numeroPropiedad, descripcion, activo = 1 } = datos;
			const resultado = await conexion.execute(
				`INSERT INTO PROPIEDAD
                (ID_CATEGORIA, NUMERO_PROPIEDAD, DESCRIPCION, ACTIVO) 
                VALUES
                (:idCategoria, :numeroPropiedad, :descripcion, :activo)
                RETURNING ID_PROPIEDAD INTO :idPropiedad`,
				{
					idCategoria,
					numeroPropiedad,
					descripcion,
					activo,
					idPropiedad: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);
			const nuevoId = resultado.outBinds.idPropiedad[0];
			return PropiedadModel.obtenerPorId({ id: nuevoId });
		} finally {
			await conexion.close();
		}
	}

	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			const camposPermitidos = {
				idCategoria: 'ID_CATEGORIA',
				numeroPropiedad: 'NUMERO_PROPIEDAD',
				descripcion: 'DESCRIPCION',
				activo: 'ACTIVO',
			};

			const setCampos = [];
			const parametros = { id };

			for (const [claveCamel, columnaOracle] of Object.entries(camposPermitidos)) {
				if (datos[claveCamel] !== undefined) {
					setCampos.push(`${columnaOracle} = :${claveCamel}`);
					parametros[claveCamel] = datos[claveCamel];
				}
			}

			if (setCampos.length === 0) return null;

			await conexion.execute(
				`UPDATE PROPIEDAD SET ${setCampos.join(', ')} WHERE ID_PROPIEDAD = :id`,
				parametros,
				{ autoCommit: true },
			);

			return PropiedadModel.obtenerPorId({ id });
		} finally {
			await conexion.close();
		}
	}

	// NUEVO MÉTODO DE ELIMINAR
	static async eliminar({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				'DELETE FROM PROPIEDAD WHERE ID_PROPIEDAD = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}
	static async generarCuotasMensuales({ propiedades = 'ALL', incluirMora = false, montoMora = 0, fechaEmision = null } = {}) {
		const conexion = await conectar();
		try {
			// Find id_tipo_cargo for "Cuota condominio"
			const resultCuota = await conexion.execute(`SELECT ID_TIPO_CARGO FROM TIPO_CARGO WHERE LOWER(NOMBRE) = 'cuota condominio'`, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
			if (resultCuota.rows.length === 0) throw new Error('Tipo de cargo "Cuota condominio" no encontrado');
			const idTipoCuota = resultCuota.rows[0].ID_TIPO_CARGO;

			let idTipoMora = null;
			if (incluirMora) {
				const resultMora = await conexion.execute(`SELECT ID_TIPO_CARGO FROM TIPO_CARGO WHERE LOWER(NOMBRE) = 'mora'`, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
				if (resultMora.rows.length === 0) throw new Error('Tipo de cargo "Mora" no encontrado');
				idTipoMora = resultMora.rows[0].ID_TIPO_CARGO;
			}

			let queryProps = `SELECT p.ID_PROPIEDAD, cp.CUOTA_MENSUAL 
                              FROM PROPIEDAD p
                              JOIN CATEGORIA_PROPIEDAD cp ON p.ID_CATEGORIA = cp.ID_CATEGORIA 
                              WHERE p.ACTIVO = 1`;
			const bindParams = {};

			if (propiedades !== 'ALL' && Array.isArray(propiedades) && propiedades.length > 0) {
				const binds = propiedades.map((_, i) => `:prop${i}`).join(',');
				queryProps += ` AND p.ID_PROPIEDAD IN (${binds})`;
				propiedades.forEach((p, i) => { bindParams[`prop${i}`] = Number(p); });
			}

			const resultProps = await conexion.execute(queryProps, bindParams, { outFormat: oracledb.OUT_FORMAT_OBJECT });
			
			// Formato seguro para la fecha
			const fechaVal = fechaEmision && /^\d{4}-\d{2}-\d{2}$/.test(fechaEmision) 
				? `TO_DATE('${fechaEmision}', 'YYYY-MM-DD')` 
				: 'SYSDATE';

			for (let prop of resultProps.rows) {
				await conexion.execute(`
					INSERT INTO CARGO (ID_PROPIEDAD, ID_TIPO_CARGO, MONTO, DESCRIPCION, ESTADO, FECHA_EMISION)
					VALUES (:idPropiedad, :idTipoCargo, :monto, :descripcion, 'PENDIENTE', ${fechaVal})
				`, {
					idPropiedad: prop.ID_PROPIEDAD,
					idTipoCargo: idTipoCuota,
					monto: prop.CUOTA_MENSUAL,
					descripcion: 'Cuota mensual de condominio'
				});

				if (incluirMora && montoMora > 0) {
					await conexion.execute(`
						INSERT INTO CARGO (ID_PROPIEDAD, ID_TIPO_CARGO, MONTO, DESCRIPCION, ESTADO, FECHA_EMISION)
						VALUES (:idPropiedad, :idTipoCargo, :monto, :descripcion, 'PENDIENTE', ${fechaVal})
					`, {
						idPropiedad: prop.ID_PROPIEDAD,
						idTipoCargo: idTipoMora,
						monto: Number(montoMora),
						descripcion: 'Mora por retraso en pago'
					});
				}
			}

			await conexion.commit();
			return true;
		} catch (error) {
			console.error('Error al ejecutar el generador de cuotas avanzado:', error);
			try { await conexion.rollback(); } catch(e) {}
			throw error;
		} finally {
			await conexion.close();
		}
	}
}
