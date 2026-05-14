// ============================================================
// 📁 RUTA: frontend/src/paginas/LlamadasAtencionPagina.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, PhoneCall } from 'lucide-react';
import { useLlamadasAtencion } from '../hooks/useLlamadasAtencion.js';
import { propiedadesApi } from '../api/propiedadesApi.js';

import { tiposCargoApi } from '../api/tiposCargo.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { formatearFecha } from '../utilidades/formatearFecha.js';
import { toast } from 'sonner';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function LlamadasAtencionPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { llamadasAtencion, llamadasAgrupadas, cargando, error, crear, actualizar, eliminar } =
		useLlamadasAtencion();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [propiedades, setPropiedades] = useState([]);
	const [cargos, setCargos] = useState([]);
	const [estadoLista, setEstadoLista] = useState(false);

	useEffect(() => {
		propiedadesApi
			.obtenerTodas()
			.then((res) => {
				setPropiedades(res.data);
			})
			.catch((e) => console.error('Error al cargar propiedades:', extraerError(e)));

		tiposCargoApi
			.obtenerTodos()
			.then((res) => {
				setCargos(res.data);
			})
			.catch((e) => console.error('Error al cargar tipos de cargo:', extraerError(e)));
	}, []);

	const [form, setForm] = useState({
		idPropiedad: '',
		idTipoCargo: '',
		descripcion: '',
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? llamadasAtencion.filter(
				(la) =>
					limpiar(la.idPropiedad).includes(termino) || limpiar(la.idTipoCargo).includes(termino),
			)
		: llamadasAtencion;

	const abrirCrear = () => {
		setForm({
			idPropiedad: '',
			idTipoCargo: '',
			descripcion: '',
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (la) => {
		setSeleccion(la);
		setForm({
			idPropiedad: la.ID_PROPIEDAD,
			idTipoCargo: la.ID_TIPO_CARGO,
			descripcion: la.DESCRIPCION,
			idAdmin: usuario.ID_USUARIO,
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (la) => {
		setSeleccion(la);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			const datosAEnviar = {
				...form,
				idPropiedad: Number(form.idPropiedad),
				idTipoCargo: Number(form.idTipoCargo),
				descripcion: form.descripcion,
				idAdmin: usuario.ID_USUARIO,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
				toast.success('Llamada de atención creada exitosamente');
			} else {
				await actualizar(seleccion.ID_LLAMADO, datosAEnviar);
				toast.success('Llamada de atención actualizada exitosamente');
			}
			setModal(null);
		} catch (err) {
			const msj = extraerError(err) || 'Ocurrió un error al guardar la llamada de atención';
			setErrorModal(msj);
			toast.error(msj);
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_LLAMADO);
			toast.success('Llamada de atención eliminada con éxito');
		} catch (err) {
			const msj = extraerError(err) || 'No se pudo eliminar la llamada de atención';
			console.error('No se pudo eliminar la llamada de atención:', msj);
			toast.error(msj);
		}
		setAEliminar(null);
	};

	if (cargando)
		return (
			<>
				<div className="loading-overlay">
					<div className="loading-card">
						{/* Loader */}
						<div className="loader-wrapper">
							<div className="loader-ring"></div>
							<div className="loader-core"></div>
						</div>

						{/* Text */}
						<div className="loading-content">
							<span className="loading-badge">
								<span className="pulse-dot"></span>
								Cargando llamadas de atención
							</span>

							<div className="loading-line">
								<div className="loading-progress"></div>
							</div>
						</div>
					</div>
				</div>

				<style jsx>{`
					.loading-overlay {
						position: fixed;
						inset: 0;
						background: rgba(4, 7, 16, 0.78);
						backdrop-filter: blur(7px);

						display: flex;
						justify-content: center;
						align-items: center;

						z-index: 9999;
					}

					.loading-card {
						width: 320px;
						padding: 32px 28px;

						border-radius: 24px;

						background: linear-gradient(145deg, rgba(15, 18, 32, 0.96), rgba(8, 11, 20, 0.98));

						border: 1px solid rgba(0, 255, 170, 0.08);

						box-shadow:
							0 0 30px rgba(0, 255, 170, 0.05),
							0 0 60px rgba(0, 0, 0, 0.45);

						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 24px;
					}

					.loader-wrapper {
						position: relative;
						width: 72px;
						height: 72px;

						display: flex;
						justify-content: center;
						align-items: center;
					}

					.loader-ring {
						position: absolute;
						width: 72px;
						height: 72px;
						border-radius: 50%;

						border: 3px solid rgba(0, 255, 170, 0.08);
						border-top: 3px solid #00ffb3;
						border-right: 3px solid #00c8ff;

						animation: rotate 1s linear infinite;

						box-shadow: 0 0 18px rgba(0, 255, 170, 0.15);
					}

					.loader-core {
						width: 18px;
						height: 18px;
						border-radius: 50%;

						background: linear-gradient(135deg, #00ffb3, #00c8ff);

						box-shadow:
							0 0 12px rgba(0, 255, 170, 0.45),
							0 0 22px rgba(0, 200, 255, 0.25);

						animation: pulse 1.5s ease-in-out infinite;
					}

					.loading-content {
						width: 100%;
						text-align: center;
					}

					.loading-badge {
						display: inline-flex;
						align-items: center;
						gap: 8px;

						padding: 7px 14px;
						border-radius: 999px;

						background: rgba(0, 255, 170, 0.06);
						border: 1px solid rgba(0, 255, 170, 0.08);

						color: #00ffb3;

						font-size: 11px;
						font-weight: 700;
						letter-spacing: 1.5px;

						margin-bottom: 18px;
					}

					.pulse-dot {
						width: 8px;
						height: 8px;
						border-radius: 50%;
						background: #00ffb3;

						animation: blink 1s infinite;
					}

					.loading-content h2 {
						color: white;
						font-size: 20px;
						font-weight: 600;

						margin-bottom: 18px;
					}

					.loading-line {
						width: 100%;
						height: 6px;

						background: rgba(255, 255, 255, 0.05);

						border-radius: 999px;
						overflow: hidden;
					}

					.loading-progress {
						width: 40%;
						height: 100%;

						border-radius: inherit;

						background: linear-gradient(90deg, #00ffb3, #00c8ff);

						animation: progressMove 1.5s ease-in-out infinite;
					}

					@keyframes rotate {
						from {
							transform: rotate(0deg);
						}

						to {
							transform: rotate(360deg);
						}
					}

					@keyframes pulse {
						0%,
						100% {
							transform: scale(1);
							opacity: 1;
						}

						50% {
							transform: scale(1.2);
							opacity: 0.7;
						}
					}

					@keyframes blink {
						0%,
						100% {
							opacity: 1;
						}

						50% {
							opacity: 0.4;
						}
					}

					@keyframes progressMove {
						0% {
							transform: translateX(-120%);
						}

						100% {
							transform: translateX(320%);
						}
					}

					@media (max-width: 480px) {
						.loading-card {
							width: 88%;
							padding: 28px 22px;
						}
					}
				`}</style>
			</>
		);
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total"
					valor={llamadasAtencion.length}
					Icono={PhoneCall}
					fondo="bg-zinc-800"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={() => setEstadoLista(!estadoLista)}>
						{estadoLista ? 'Ver detalles' : 'Agrupar conteo'}
					</BtnPrimario>
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nueva llamada de atención
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={
							!estadoLista
								? ['#', 'Nombre', 'Descripción', 'Fecha', 'Acciones']
								: ['#', 'Propiedad', 'Descripción', 'Cantidad', 'Acciones']
						}
					/>
					<tbody>
						{!estadoLista
							? filtrados.map((la, index) => (
									<Fila
										key={la.ID_LLAMADO}
										seleccionada={filaActiva === la.ID_LLAMADO}
										onClick={() => setFilaActiva(filaActiva === la.ID_LLAMADO ? null : la.ID_LLAMADO)}
									>
										<Celda mono>{index + 1}</Celda>
										<Celda>{la.NOMBRE}</Celda>
										<Celda>{la.DESCRIPCION}</Celda>
										<Celda>{formatearFecha(la.FECHA_EMISION)}</Celda>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<BtnAccion onClick={() => abrirVer(la)} Icono={Eye} titulo="Ver" />
												{esAdmin && (
													<>
														<BtnAccion onClick={() => abrirEditar(la)} Icono={Pencil} titulo="Editar" />
														<BtnAccion
															onClick={() => setAEliminar(la)}
															Icono={Trash2}
															titulo="Eliminar"
															colorHover="hover:text-red-400"
														/>
													</>
												)}
											</div>
										</td>
									</Fila>
								))
							: llamadasAgrupadas.map((la, index) => (
									<Fila
										key={la.ID_LLAMADO}
										seleccionada={filaActiva === la.ID_LLAMADO}
										onClick={() => setFilaActiva(filaActiva === la.ID_LLAMADO ? null : la.ID_LLAMADO)}
									>
										<Celda mono>{index + 1}</Celda>
										<Celda>{la.NUMERO_PROPIEDAD}</Celda>
										<Celda>{la.DESCRIPCION}</Celda>
										<Celda>{la.CANTIDAD}</Celda>
										<td className="px-4 py-3">
											<div className="flex items-center gap-1">
												<BtnAccion onClick={() => abrirVer(la)} Icono={Eye} titulo="Ver" />
											</div>
										</td>
									</Fila>
								))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={llamadasAtencion.length} unidad="llamados" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nueva llamada' : 'Editar llamada'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Propiedad">
								<Selector
									required
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: Number(e.target.value) })}
								>
									<option value="">Seleccionar...</option>
									{propiedades.map((p) => (
										<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>
											{p.NUMERO_PROPIEDAD}
										</option>
									))}
								</Selector>
							</Campo>
							<Campo etiqueta="Tipo de Cargo">
								<Selector
									required
									value={form.idTipoCargo}
									onChange={(e) => setForm({ ...form, idTipoCargo: Number(e.target.value) })}
								>
									<option value="">Seleccionar...</option>
									{cargos.map(
										(c) =>
											c.NOMBRE.includes('Multa') && (
												<option key={c.ID_TIPO_CARGO} value={c.ID_TIPO_CARGO}>
													{c.NOMBRE}
												</option>
											),
									)}
								</Selector>
							</Campo>
						</div>
						<Campo etiqueta="Descripción">
							<textarea
								required
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Agregue una pequeña descripción del motivo del llamado de atención..."
								rows={3}
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
							/>
						</Campo>
						{errorModal && <p className="text-red-400 text-xs">{errorModal}</p>}
						<BotonesModal
							alCancelar={() => setModal(null)}
							textoGuardar={modal === 'crear' ? 'Crear' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{modal === 'ver' && seleccion && (
				<Modal titulo="Detalle de la llamada" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['Cargo', seleccion.NOMBRE],
							['Descripcion', seleccion.DESCRIPCION],
							['Fecha de Emisión', formatearFecha(seleccion.FECHA_EMISION)],
						].map(([lbl, val]) => (
							<div key={lbl} className="flex justify-between border-b border-borde pb-2">
								<span className="text-secundario">{lbl}</span>
								<span className="text-primario font-medium">{val}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar llamado?"
					mensaje={`Se eliminará el llamado "${aEliminar.ID_LLAMADO}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
