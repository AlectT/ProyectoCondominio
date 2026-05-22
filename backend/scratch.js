const knex = require('knex')({ 
    client: 'oracledb',
    wrapIdentifier: (value, origImpl, queryContext) => {
        if (value === 'value' || value === 'label') return '\"' + value + '\"';
        return origImpl(value.toUpperCase());
    }
});
const { getRequiredJoins } = require('./src/utils/pathfinder.js');
try {
    const queryBuilder = knex('PAGO');
    const joins = getRequiredJoins('PAGO', ['USUARIO', 'PAGO']);
    joins.forEach(join => {
        queryBuilder.join(join.table, join.left, join.operator, join.right);
    });
    queryBuilder.select([knex.raw('USUARIO.nombre AS label'), knex.raw('SUM(PAGO.monto_total) as \"value\"')]);
    queryBuilder.groupByRaw('USUARIO.nombre');
    
    // Simulating filters
    const f = { field: 'PAGO.estado', operator: '=', value: 'PAGADO' };
    const fieldRaw = knex.raw(f.field);
    queryBuilder.where(fieldRaw, f.operator, f.value);

    console.log(queryBuilder.toSQL().toNative());
} catch(e) {
    console.error('ERROR:', e);
}
