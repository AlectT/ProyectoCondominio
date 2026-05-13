import 'dotenv/config';

const required = (name) => {
	const value = process.env[name];
	if (!value) throw new Error(`Variable de entorno requerida: ${name}`);
	return value;
};

// Servidor
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Base de datos
export const DB_USER = required('DB_USER');
export const DB_PASSWORD = required('DB_PASSWORD');
export const DB_HOST = required('DB_HOST');
export const DB_PORT = process.env.DB_PORT || 1521;
export const DB_SERVICE = required('DB_SERVICE');
export const DB_SSL = process.env.DB_SSL === 'true'; // false si no existe

// Autenticación
export const SECRET_JWT_KEY = required('SECRET_JWT_KEY');
export const SALT_ROUND = parseInt(process.env.SALT_ROUND) || 10;

// CORS
export const CORS_ORIGINS = process.env.CORS_ORIGINS
	? process.env.CORS_ORIGINS.split(',')
	: [];
