import express from 'express';

import {
	reportePagos,
	reporteMoras,
	reporteReservas,
	reporteMultas,
	reporteDinamico
} from '../controllers/reportes.controller.js';
import { autenticacion } from '../middlewares/autenticacion.js';

const router = express.Router();

router.get('/pagos', reportePagos);

router.get('/moras', reporteMoras);

router.get('/reservas', reporteReservas);

router.get('/multas', reporteMultas);

router.post('/query', autenticacion, reporteDinamico);

export default router;
