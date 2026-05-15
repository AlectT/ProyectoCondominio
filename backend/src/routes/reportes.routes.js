import express from 'express';

import {
	reportePagos,
	reporteMoras,
	reporteReservas,
	reporteMultas,
} from '../controllers/reportes.controller.js';

const router = express.Router();

router.get('/pagos', reportePagos);

router.get('/moras', reporteMoras);

router.get('/reservas', reporteReservas);

router.get('/multas', reporteMultas);

export default router;
