import cors from 'cors';

const origenesAceptados = [
	'http://localhost:8080',
	'http://localhost:1234',
	'http://localhost:3000',
	'http://localhost:5173',
	'http://localhost:1000',
	'http://192.168.140.138:5173',
	'http://10.26.177.19:5173',
	'http://192.168.0.9:5173',
];

export const middlewareCors = ({ origenes = origenesAceptados } = {}) =>
	cors({
		origin: (origen, callback) => {
			if (origenes.includes(origen)) {
				return callback(null, true);
			}
			if (!origen) {
				return callback(null, true);
			}
			return callback(new Error('Origen no permitido por CORS'));
		},
		credentials: true,
	});
