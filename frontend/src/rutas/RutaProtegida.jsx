import { Navigate } from 'react-router-dom';
import useStore from '../estado/useStore.js';

export function RutaProtegida({ children, rolesPermitidos }) {
	const usuario = useStore((s) => s.usuario);

	if (!usuario) return <Navigate to="/login" replace />;

	if (rolesPermitidos && !rolesPermitidos.includes(usuario.ROL)) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}
