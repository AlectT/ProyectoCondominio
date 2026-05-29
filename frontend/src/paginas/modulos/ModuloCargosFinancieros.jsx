// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloCargosFinancieros.jsx
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Search, FileText, ChevronDown } from 'lucide-react';
import { cargosFinancierosApi } from '../../api/cargosFinancieros';
import { propiedadesApi } from '../../api/propiedadesApi';
import {
	limpiarAlfanumerico,
	validarNumeroPropiedad,
} from '../../utilidades/validarTexto.js';
import { toast } from 'sonner';

export default function ModuloCargosFinancieros() {
	const [idPropiedad, setIdPropiedad] = useState('');
	const [textoPropiedad, setTextoPropiedad] = useState('');
	const [mostrarLista, setMostrarLista] = useState(false);
	const [propiedades, setPropiedades] = useState([]);
	const [cargos, setCargos] = useState([]);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		cargarPropiedades();
	}, []);

	async function cargarPropiedades() {
		try {
			const res = await propiedadesApi.obtenerTodas();
			setPropiedades(Array.isArray(res.data) ? res.data : []);
		} catch (err) {
			console.error(err);
			toast.error('No se pudieron cargar las propiedades.');
			setPropiedades([]);
		}
	}

	function sanitizarPropiedad(valor) {
		return limpiarAlfanumerico(valor)
			.toUpperCase()
			.slice(0, 12);
	}

	const propiedadesFiltradas = useMemo(() => {
		const texto = textoPropiedad.trim().toLowerCase();

		if (!texto) return propiedades;

		return propiedades.filter((propiedad) =>
			String(propiedad.NUMERO_PROPIEDAD ?? '')
				.toLowerCase()
				.includes(texto),
		);
	}, [propiedades, textoPropiedad]);

	function manejarCambioPropiedad(e) {
		const valorLimpio = sanitizarPropiedad(e.target.value);

		setTextoPropiedad(valorLimpio);
		setIdPropiedad('');
		setMostrarLista(true);
		setError('');
		setCargos([]);
	}

	function seleccionarPropiedad(propiedad) {
		const numeroPropiedad = sanitizarPropiedad(String(propiedad.NUMERO_PROPIEDAD ?? ''));

		setIdPropiedad(propiedad.ID_PROPIEDAD);
		setTextoPropiedad(numeroPropiedad);
		setMostrarLista(false);
		setError('');
	}

	const consultar = async () => {
		const textoLimpio = sanitizarPropiedad(textoPropiedad).trim();

		if (!textoLimpio) {
			setError('Debes escribir o seleccionar una propiedad.');
			toast.warning('Debes escribir o seleccionar una propiedad.');
			setCargos([]);
			return;
		}

		if (!validarNumeroPropiedad(textoLimpio)) {
			setError('La propiedad solo puede contener letras, números y guiones. Ejemplo: A-101.');
			toast.warning('Formato de propiedad inválido.');
			setCargos([]);
			return;
		}

		if (textoLimpio.length > 12) {
			setError('El código de propiedad es demasiado largo.');
			toast.warning('El código de propiedad es demasiado largo.');
			setCargos([]);
			return;
		}

		if (!idPropiedad) {
			setError('Debes seleccionar una propiedad válida de la lista.');
			toast.warning('Debes seleccionar una propiedad válida de la lista.');
			setCargos([]);
			return;
		}

		try {
			setCargando(true);
			setError('');

			const res = await cargosFinancierosApi.obtenerPorPropiedad(idPropiedad);
			setCargos(Array.isArray(res.data) ? res.data : []);
		} catch (err) {
			console.error(err);
			setError('No se pudo consultar el estado de cuenta.');
			toast.error('No se pudo consultar el estado de cuenta.');
			setCargos([]);
		} finally {
			setCargando(false);
		}
	};

	return (
		<div className="space-y-6 p-6 text-white">
			<div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
				<div className="mb-4 flex items-center gap-3">
					<CreditCard className="h-6 w-6 text-emerald-400" />

					<div>
						<h1 className="text-2xl font-bold">Cargos Financieros</h1>

						<p className="text-sm text-zinc-400">
							Consulta de estado de cuenta por propiedad. Módulo de solo lectura.
						</p>
					</div>
				</div>

				<div className="flex gap-3">
					<div className="relative w-full">
						<input
							type="text"
							value={textoPropiedad}
							maxLength={12}
							onChange={manejarCambioPropiedad}
							onFocus={() => setMostrarLista(true)}
							placeholder="Escriba o seleccione una propiedad. Ej: A-101"
							className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 pr-10 outline-none"
						/>

						<button
							type="button"
							onClick={() => setMostrarLista(!mostrarLista)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
						>
							<ChevronDown className="h-5 w-5" />
						</button>

						{mostrarLista && (
							<div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-zinc-950 shadow-xl">
								{propiedadesFiltradas.length === 0 ? (
									<div className="px-4 py-3 text-sm text-zinc-400">
										No se encontraron propiedades.
									</div>
								) : (
									propiedadesFiltradas.map((propiedad) => (
										<button
											key={propiedad.ID_PROPIEDAD}
											type="button"
											onClick={() => seleccionarPropiedad(propiedad)}
											className="block w-full px-4 py-3 text-left text-sm hover:bg-zinc-800"
										>
											<span className="font-semibold">
												{propiedad.NUMERO_PROPIEDAD}
											</span>

											<span className="ml-2 text-xs text-zinc-500">
												ID: {propiedad.ID_PROPIEDAD}
											</span>
										</button>
									))
								)}
							</div>
						)}
					</div>

					<button
						onClick={consultar}
						disabled={cargando}
						className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
					>
						<Search className="h-4 w-4" />
						{cargando ? 'Consultando...' : 'Consultar'}
					</button>
				</div>

				{error && (
					<div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
						{error}
					</div>
				)}
			</div>

			<div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
				<div className="mb-4 flex items-center gap-2">
					<FileText className="h-5 w-5 text-sky-400" />

					<h2 className="text-lg font-semibold">Estado de cuenta</h2>
				</div>

				{cargando ? (
					<p className="text-zinc-400">Cargando...</p>
				) : cargos.length === 0 ? (
					<p className="text-zinc-400">No hay datos para mostrar.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="border-b border-white/10 text-zinc-400">
								<tr>
									<th className="px-3 py-3">Periodo</th>
									<th className="px-3 py-3">Descripción</th>
									<th className="px-3 py-3">Monto</th>
									<th className="px-3 py-3">Estado</th>
									<th className="px-3 py-3">Vencimiento</th>
								</tr>
							</thead>

							<tbody>
								{cargos.map((cargo, index) => (
									<tr
										key={cargo.ID_CARGO || index}
										className="border-b border-white/5"
									>
										<td className="px-3 py-3">{cargo.PERIODO}</td>
										<td className="px-3 py-3">{cargo.DESCRIPCION}</td>
										<td className="px-3 py-3">Q {cargo.MONTO}</td>
										<td className="px-3 py-3">{cargo.ESTADO}</td>
										<td className="px-3 py-3">{cargo.FECHA_VENCIMIENTO}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}