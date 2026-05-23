import axios from './axios.js';

export const obtenerReporteDinamico = async (baseEntity, limit, payload) => {
    try {
        const respuesta = await axios.post('/reportes/query', payload);
        return respuesta.data;
    } catch (error) {
        console.error('Error al obtener reporte dinámico:', error);
        throw error;
    }
};
