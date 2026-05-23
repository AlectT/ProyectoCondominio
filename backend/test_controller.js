import http from 'http';

const payload = JSON.stringify({
    baseEntity: 'RESERVA',
    selections: ["RESERVA.estado AS label"],
    aggregations: [{ type: 'COUNT', field: '1', alias: 'value' }],
    groupBys: ["RESERVA.estado"],
    filters: [{ field: 'RESERVA.estado', operator: '=', value: 'FINALIZADA' }]
});

// Since the API requires auth, this will probably get 401 Unauthorized unless I get a valid JWT or bypass it.
// Instead of HTTP, I can just write a script that connects to the database via reportes.service.js to verify.
// But the issue is whether the backend route handles it correctly!
// I'll create a mock request object and call the controller directly.
import { reporteDinamico } from './src/controllers/reportes.controller.js';

const mockReq = {
    usuario: { ROL: 'Administrador', ID_USUARIO: 1 },
    body: {
        baseEntity: 'RESERVA',
        selections: ["RESERVA.estado AS label"],
        aggregations: [{ type: 'COUNT', field: '1', alias: 'value' }],
        groupBys: ["RESERVA.estado"],
        filters: [{ field: 'RESERVA.estado', operator: '=', value: 'FINALIZADA' }]
    }
};

const mockRes = {
    status: (code) => ({
        json: (data) => console.log('STATUS:', code, 'DATA:', data)
    }),
    json: (data) => console.log('DATA:', data)
};

console.log('Testing controller directly...');
reporteDinamico(mockReq, mockRes).catch(console.error);
