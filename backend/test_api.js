import http from 'http';

const payload = JSON.stringify({
    baseEntity: 'RESERVA',
    selections: ["RESERVA.hora_inicio || ' - ' || RESERVA.hora_fin AS label"],
    aggregations: [{ type: 'COUNT', field: '1', alias: 'value' }],
    groupBys: ["RESERVA.hora_inicio || ' - ' || RESERVA.hora_fin"],
    filters: []
});

const req = http.request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/reportes/dinamico/RESERVA',
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': 'Bearer test' // This might fail JWT auth, but let's see.
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', data));
});
req.on('error', e => console.error(e));
req.write(payload);
req.end();
