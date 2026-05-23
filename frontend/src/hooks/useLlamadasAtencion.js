import { useState, useEffect, useCallback } from 'react';
import { llamadasAtencionApi } from '../api/llamadasAtencionApi';

export function useLlamadasAtencion() {
	const [llamadasAtencion, setLlamadasAtencion] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState(null);
	const [llamadasAgrupadas, setLlamadasAgrupadas] = useState([]);

	const cargar = useCallback(async () => {
		setCargando(false);
		setError(null);
		try {
			const res = await llamadasAtencionApi.obtenerTodos();
			setLlamadasAtencion(res.data);
			const resAgrupados = await llamadasAtencionApi.obtenerTodosAgrupados();
			setLlamadasAgrupadas(resAgrupados.data);
		} catch (err) {
			setError(err.response?.data?.mensaje ?? 'Error al cargar llamadasAtencion.');
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		cargar();
	}, [cargar]);

	const crear = async (datos) => {
		await llamadasAtencionApi.crear(datos);
		await cargar();
	};

	const actualizar = async (id, datos) => {
		await llamadasAtencionApi.actualizar(id, datos);
		await cargar();
	};

	const eliminar = async (id) => {
		await llamadasAtencionApi.eliminar(id);
		await cargar();
	};

	return {
		llamadasAtencion,
		llamadasAgrupadas,
		cargando,
		error,
		cargar,
		crear,
		actualizar,
		eliminar,
	};
}
