import cors from 'cors';
import { IS_PRODUCTION, CORS_ORIGINS } from '../config/config.js';

export const middlewareCors = ({ origenes = CORS_ORIGINS } = {}) =>
	cors({
		origin: (origen, callback) => {
			if (!origen) {
				return callback(
					IS_PRODUCTION ? new Error('Origen no permitido por CORS') : null,
					!IS_PRODUCTION,
				);
			}
			if (origenes.includes(origen)) {
				return callback(null, true);
			}
			return callback(new Error('Origen no permitido por CORS'));
		},
		credentials: true,
	});
