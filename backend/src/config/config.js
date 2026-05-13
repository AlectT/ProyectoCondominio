import 'dotenv/config';

const required = (name) => {
	const value = process.env[name];
	if (!value) throw new Error(` Variable de entorno requerida: ${name}`);
	return value;
};

// Servidor
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Base de datos
export const DB_USER = required('DB_USER');
export const DB_PASSWORD = required('DB_PASSWORD');

// En producción usa el connection string completo, en dev construye desde las partes
export const DB_CONNECTION_STRING = IS_PRODUCTION
	? required('DB_CONNECTION_STRING')
	: `${required('DB_HOST')}:${process.env.DB_PORT || 1521}/${required('DB_SERVICE')}`;

// Autenticación
export const SECRET_JWT_KEY = required('SECRET_JWT_KEY');
export const SALT_ROUND = parseInt(process.env.SALT_ROUND) || 10;

// CORS
export const CORS_ORIGINS = process.env.CORS_ORIGINS
	? process.env.CORS_ORIGINS.split(',')
	: [];
