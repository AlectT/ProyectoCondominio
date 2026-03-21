// ============================================================
// 📁 RUTA: backend/src/models/invitacion.js
// ============================================================

import oracledb from 'oracledb';
import { conectar } from '../config/db.js';

// ID_TIPO en TIPO_INVITACION:
//   1 = Normal   (un solo uso, expira a las 23:59)
//   2 = Servicio (reutilizable, sin expiración)
const ID_TIPO_NORMAL = 1;
const ID_TIPO_SERVICIO = 2;

const consultaBase = `
  SELECT
    i.ID_INVITACION,
    i.ID_USUARIO,
    i.ID_TIPO,
    t.NOMBRE        AS TIPO_NOMBRE,
    i.NOMBRE_VISITANTE,
    i.CODIGO_QR,
    i.FECHA_GENERACION,
    i.FECHA_EXPIRACION,
    i.ACTIVO
  FROM INVITACION i
  JOIN TIPO_INVITACION t ON i.ID_TIPO = t.ID_TIPO
`;

export class InvitacionModel {
	// ── OBTENER TODAS ─────────────────────────────────────────
	static async obtenerTodas() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' ORDER BY i.FECHA_GENERACION DESC',
				{},
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows;
		} finally {
			await conexion.close();
		}
	}

	// ── OBTENER POR ID ────────────────────────────────────────
	static async obtenerPorId({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' WHERE i.ID_INVITACION = :id',
				{ id },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);
			return resultado.rows[0] ?? null;
		} finally {
			await conexion.close();
		}
	}

	// ── CREAR ─────────────────────────────────────────────────
	// RN-I2: tipo Normal (1) o Servicio (2)
	// RN-I3: Normal expira a las 23:59 del día, Servicio = NULL
	// RN-I4: se genera un código QR único
	static async crear({ datos }) {
		const conexion = await conectar();
		try {
			const { nombreVisitante, idTipo, idUsuario } = datos;

			// RN-I3 — calcular fecha de expiración
			let fechaExpiracion = null;
			if (idTipo === ID_TIPO_NORMAL) {
				const hoy = new Date();
				hoy.setHours(23, 59, 59, 0);
				fechaExpiracion = hoy;
			}

			// RN-I4 — código QR único
			const codigoQR = `QR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

			const resultado = await conexion.execute(
				`INSERT INTO INVITACION
					(ID_USUARIO, ID_TIPO, NOMBRE_VISITANTE,
					 CODIGO_QR, FECHA_GENERACION, FECHA_EXPIRACION, ACTIVO)
				 VALUES
					(:idUsuario, :idTipo, :nombreVisitante,
					 :codigoQR, SYSDATE, :fechaExpiracion, 1)
				 RETURNING ID_INVITACION INTO :idInvitacion`,
				{
					idUsuario,
					idTipo,
					nombreVisitante,
					codigoQR,
					fechaExpiracion,
					idInvitacion: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
				},
				{ autoCommit: true },
			);

			const nuevoId = resultado.outBinds.idInvitacion[0];
			return InvitacionModel.obtenerPorId({ id: nuevoId });
		} finally {
			await conexion.close();
		}
	}

	// ── ACTUALIZAR ────────────────────────────────────────────
	// Solo se permite editar el nombre del visitante
	static async actualizar({ id, datos }) {
		const conexion = await conectar();
		try {
			const camposPermitidos = {
				nombreVisitante: 'NOMBRE_VISITANTE',
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
				`UPDATE INVITACION SET ${setCampos.join(', ')} WHERE ID_INVITACION = :id`,
				parametros,
				{ autoCommit: true },
			);

			return InvitacionModel.obtenerPorId({ id });
		} finally {
			await conexion.close();
		}
	}

	// ── ELIMINAR ──────────────────────────────────────────────
	static async eliminar({ id }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				'DELETE FROM INVITACION WHERE ID_INVITACION = :id',
				{ id },
				{ autoCommit: true },
			);
			return resultado.rowsAffected > 0;
		} finally {
			await conexion.close();
		}
	}

	// ── DESACTIVAR ────────────────────────────────────────────
	// RN-I5: Servicio se desactiva manualmente → ACTIVO = 0
	static async desactivar({ id }) {
		const conexion = await conectar();
		try {
			await conexion.execute(
				'UPDATE INVITACION SET ACTIVO = 0 WHERE ID_INVITACION = :id',
				{ id },
				{ autoCommit: true },
			);
			return InvitacionModel.obtenerPorId({ id });
		} finally {
			await conexion.close();
		}
	}

	// ── VALIDAR QR EN GARITA ──────────────────────────────────
	// RN-I4: validación mediante código QR
	// RN-I5: Normal = un solo uso → ACTIVO = 0 tras escanearse
	//        Servicio = reutilizable, no cambia estado
	static async validarQR({ codigoQR }) {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				consultaBase + ' WHERE i.CODIGO_QR = :codigoQR',
				{ codigoQR },
				{ outFormat: oracledb.OUT_FORMAT_OBJECT },
			);

			const invitacion = resultado.rows[0];
			if (!invitacion) return null;

			// RN-I5: Normal activo → desactivar tras primer uso
			if (invitacion.ID_TIPO === ID_TIPO_NORMAL && invitacion.ACTIVO === 1) {
				await conexion.execute(
					'UPDATE INVITACION SET ACTIVO = 0 WHERE CODIGO_QR = :codigoQR',
					{ codigoQR },
					{ autoCommit: true },
				);
				invitacion.ACTIVO = 0;
			}

			return invitacion;
		} finally {
			await conexion.close();
		}
	}

	// ── EXPIRAR VENCIDAS ──────────────────────────────────────
	// RN-I3: Normal que pasó las 23:59 → ACTIVO = 0
	static async expirarVencidas() {
		const conexion = await conectar();
		try {
			const resultado = await conexion.execute(
				`UPDATE INVITACION
				 SET ACTIVO = 0
				 WHERE ID_TIPO  = :idTipoNormal
				   AND ACTIVO   = 1
				   AND FECHA_EXPIRACION < SYSDATE`,
				{ idTipoNormal: ID_TIPO_NORMAL },
				{ autoCommit: true },
			);
			return resultado.rowsAffected;
		} finally {
			await conexion.close();
		}
	}
}
