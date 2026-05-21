import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { ejecutarConsulta } from '../services/reportes.service.js';
import initKnex from 'knex';
import { getRequiredJoins } from '../utils/pathfinder.js';

const knex = initKnex({ 
    client: 'oracledb',
    wrapIdentifier: (value, origImpl, queryContext) => {
        if (value === 'value' || value === 'label') return `"${value}"`;
        return origImpl(value.toUpperCase());
    }
});

const TABLAS_PUBLICAS = ['AREA_SOCIAL', 'CATEGORIA_PROPIEDAD', 'TIPO_CARGO', 'TIPO_INVITACION'];

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

export const reporteDinamico = async (req, res) => {
    try {
        const { baseEntity, selections = [], aggregations = [], groupBys = [], filters = [], limit } = req.body;
        
        if (!baseEntity) {
            return res.status(400).json({ ok: false, mensaje: 'La entidad base es obligatoria.' });
        }

        const rolUsuario = req.usuario.ROL.trim();
        const idUsuario = req.usuario.ID_USUARIO;
        
        // 1. Identificar todas las tablas involucradas
        const requiredTables = new Set();
        requiredTables.add(baseEntity);

        const extractTable = (field) => {
            // Quitar alias (ej: 'USUARIO.nombre AS label' → 'USUARIO.nombre')
            const cleanField = field.split(/\s+AS\s+/i)[0].trim();
            if (cleanField.includes('.')) return cleanField.split('.')[0].toUpperCase();
            return baseEntity;
        };

        selections.forEach(sel => requiredTables.add(extractTable(sel)));
        aggregations.forEach(agg => requiredTables.add(extractTable(agg.field)));
        groupBys.forEach(gb => requiredTables.add(extractTable(gb)));
        filters.forEach(f => requiredTables.add(extractTable(f.field)));

        // Si el usuario es Residente y la tabla base no es pública, inyectamos RLS
        let isRLSApplied = false;
        if (rolUsuario === 'Residente') {
            if (!TABLAS_PUBLICAS.includes(baseEntity)) {
                if (baseEntity === 'USUARIO') {
                    requiredTables.add('USUARIO');
                } else {
                    requiredTables.add('USUARIO_PROPIEDAD');
                }
                isRLSApplied = true;
            }
        }

        let joins = [];
        try {
            joins = getRequiredJoins(baseEntity, Array.from(requiredTables));
        } catch (error) {
            if (isRLSApplied) {
                return res.status(403).json({ ok: false, mensaje: 'Acceso denegado: No se puede establecer una ruta hacia tu usuario para esta consulta.' });
            }
            return res.status(400).json({ ok: false, mensaje: error.message });
        }

        // 3. Construir la consulta con Knex
        const queryBuilder = knex(baseEntity);

        joins.forEach(join => {
            queryBuilder.join(join.table, join.left, join.operator, join.right);
        });

        // RLS: Filtrar por el usuario actual
        if (isRLSApplied) {
            if (baseEntity === 'USUARIO') {
                queryBuilder.where('USUARIO.id_usuario', idUsuario);
            } else {
                queryBuilder.where('USUARIO_PROPIEDAD.id_usuario', idUsuario);
            }
        }

        // Selecciones y alias
        if (selections.length > 0) {
            queryBuilder.select(selections.map(s => knex.raw(s)));
        }

        // Agregaciones
        aggregations.forEach(agg => {
            const rawAgg = `${agg.type}(${agg.field}) as "${agg.alias}"`;
            queryBuilder.select(knex.raw(rawAgg));
        });

        // Filtros adicionales
        filters.forEach(f => {
            if (f.operator === 'LIKE') {
                queryBuilder.where(f.field, 'LIKE', `%${f.value}%`);
            } else {
                queryBuilder.where(f.field, f.operator, f.value);
            }
        });

        if (groupBys.length > 0) {
            // Usar raw para que el groupBy respete mayúsculas de Oracle sin wrapIdentifier
            queryBuilder.groupByRaw(groupBys.join(', '));
        }

        if (limit) {
            if (aggregations.length > 0) {
                queryBuilder.orderBy('value', 'desc');
            }
            queryBuilder.limit(limit);
        }

        // 4. Extraer SQL y bindings
        const nativeQuery = queryBuilder.toSQL().toNative();
        console.log('\n=== SQL GENERADO ===\n', nativeQuery.sql);
        console.log('=== BINDINGS ===\n', JSON.stringify(nativeQuery.bindings));
        
        const data = await ejecutarConsulta(nativeQuery.sql, nativeQuery.bindings);
        res.json({ ok: true, data });

    } catch (error) {
        console.error('Error generando reporte dinámico:', error.message);
        res.status(500).json({
            ok: false,
            mensaje: error.message || 'Error interno ejecutando la consulta dinámica.'
        });
    }
};
