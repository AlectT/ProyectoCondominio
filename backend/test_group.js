import { ejecutarConsulta } from './src/services/reportes.service.js';
import initKnex from 'knex';

const knex = initKnex({ 
    client: 'oracledb',
    wrapIdentifier: (value, origImpl) => {
        if (value === 'value' || value === 'label') return '"' + value + '"';
        return origImpl(value.toUpperCase());
    }
});

async function run() {
    try {
        const queryBuilder = knex('RESERVA');
        queryBuilder.select(knex.raw("RESERVA.hora_inicio || ' - ' || RESERVA.hora_fin AS label"));
        queryBuilder.select(knex.raw('COUNT(1) as "value"'));
        queryBuilder.groupByRaw("RESERVA.hora_inicio || ' - ' || RESERVA.hora_fin");

        const nativeQuery = queryBuilder.toSQL().toNative();
        console.log('SQL:', nativeQuery.sql);
        
        const data = await ejecutarConsulta(nativeQuery.sql, nativeQuery.bindings);
        console.log('Data:', data);
    } catch(e) {
        console.error('Error:', e);
    }
    process.exit(0);
}
run();
