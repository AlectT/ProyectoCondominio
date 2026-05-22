import { reporteDinamico } from './src/controllers/reportes.controller.js';

const mockReq = {
    usuario: { ROL: 'Administrador', ID_USUARIO: 1 },
    body: {
        baseEntity: 'RESERVA',
        selections: ["RESERVA.estado AS label"],
        aggregations: [{ type: 'COUNT', field: '1', alias: 'value' }],
        groupBys: ["RESERVA.estado"],
        filters: [{ field: "RESERVA.hora_inicio || ' - ' || RESERVA.hora_fin", operator: '=', value: '20:00 - 21:00' }]
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
