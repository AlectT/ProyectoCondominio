import { ejecutarConsulta } from './src/services/reportes.service.js';
import initKnex from 'knex';
import { getRequiredJoins } from './src/utils/pathfinder.js';

const knex = initKnex({ 
    client: 'oracledb',
    wrapIdentifier: (value, origImpl, queryContext) => {
        if (value === 'value' || value === 'label') return `"${value}"`;
        return origImpl(value.toUpperCase());
    }
});

async function run() {
    try {
        const baseEntity = 'RESERVA';
        const selections = ['RESERVA.estado AS label'];
        const aggregations = [{ type: 'COUNT', field: '1', alias: 'value' }];
        const groupBys = ['RESERVA.estado'];
        const filters = [{ field: 'RESERVA.estado', operator: '=', value: 'APARTADA' }];
        const idUsuario = 1;
        const isRLSApplied = false;

        const requiredTables = new Set(['RESERVA']);
        const joins = getRequiredJoins(baseEntity, Array.from(requiredTables));

        const queryBuilder = knex(baseEntity);

        joins.forEach(join => {
            queryBuilder.join(join.table, join.left, join.operator, join.right);
        });

        if (selections.length > 0) {
            queryBuilder.select(selections.map(s => knex.raw(s)));
        }

        aggregations.forEach(agg => {
            const rawAgg = `${agg.type}(${agg.field}) as "${agg.alias}"`;
            queryBuilder.select(knex.raw(rawAgg));
        });

        filters.forEach(f => {
            if (f.field.includes('||')) {
                if (f.operator === 'LIKE') {
                    queryBuilder.whereRaw(`${f.field} LIKE ?`, [`%${f.value}%`]);
                } else {
                    queryBuilder.whereRaw(`${f.field} ${f.operator} ?`, [f.value]);
                }
            } else {
                if (f.operator === 'LIKE') {
                    queryBuilder.where(f.field, 'LIKE', `%${f.value}%`);
                } else {
                    queryBuilder.where(f.field, f.operator, f.value);
                }
            }
        });

        if (groupBys.length > 0) {
            queryBuilder.groupByRaw(groupBys.join(', '));
        }

        const nativeQuery = queryBuilder.toSQL().toNative();
        console.log('SQL:', nativeQuery.sql);
        console.log('Bindings:', nativeQuery.bindings);
        
        const data = await ejecutarConsulta(nativeQuery.sql, nativeQuery.bindings);
        console.log('Data:', data);
    } catch(e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
run();
