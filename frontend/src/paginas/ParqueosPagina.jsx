// ============================================================
// 📁 RUTA: frontend/src/paginas/ParqueosPagina.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, Clock, XCircle, CarFront } from 'lucide-react';
import { useParqueos } from '../hooks/useParqueo.js';
import { propiedadesApi } from '../api/propiedadesApi.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { toast } from 'sonner';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function ParqueosPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { parqueos, cargando, error, crear, actualizar, eliminar } = useParqueos();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [propiedades, setPropiedades] = useState([]);

	useEffect(() => {
		propiedadesApi
			.obtenerTodas()
			.then((res) => {
				setPropiedades(res.data);
			})
			.catch((e) => console.error('Error al cargar propiedades:', extraerError(e)));
	}, []);

	const [form, setForm] = useState({
		idPropiedad: '',
		numeroParqueo: '',
		descripcion: '',
		activo: 1,
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? parqueos.filter(
				(p) =>
					limpiar(p.NUMERO_PARQUEO).includes(termino) ||
					limpiar(p.ACTIVO).includes(termino) ||
					limpiar(p.ID_PARQUEO?.toString()).includes(termino),
			)
		: parqueos;

	const abrirCrear = () => {
		setForm({
			idPropiedad: '',
			numeroParqueo: '',
			descripcion: '',
			activo: 1,
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (p) => {
		setSeleccion(p);
		setForm({
			idPropiedad: p.ID_PROPIEDAD,
			numeroParqueo: p.NUMERO_PARQUEO,
			descripcion: p.DESCRIPCION,
			activo: p.ACTIVO,
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (p) => {
		setSeleccion(p);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			const datosAEnviar = {
				...form,
				idPropiedad: Number(form.idPropiedad),
				numeroParqueo: form.numeroParqueo,
				descripcion: form.descripcion,
				activo: form.activo,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
				toast.success('Parqueo creado exitosamente');
			} else {
				await actualizar(seleccion.ID_PARQUEO, datosAEnviar);
				toast.success('Parqueo actualizado exitosamente');
			}
			setModal(null);
		} catch (err) {
			const msj = extraerError(err) || 'Error al guardar el parqueo';
			setErrorModal(msj);
			toast.error(msj);
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_PARQUEO);
			toast.success('Parqueo eliminado exitosamente');
		} catch (err) {
			const msj = extraerError(err) || 'Error al eliminar el parqueo';
			console.error('Error al eliminar el parqueo:', msj);
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
								Cargando parqueos
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
					valor={parqueos.length}
					Icono={CarFront}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={parqueos.filter((p) => p.ACTIVO === 1).length}
					Icono={Clock}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inactivos"
					valor={parqueos.filter((p) => p.ACTIVO === 0).length}
					Icono={XCircle}
					fondo="bg-zinc-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nuevo Parqueo
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['#', 'No. Parqueo', 'Descripción', 'Propiedad', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((p) => (
							<Fila
								key={p.ID_PARQUEO}
								seleccionada={filaActiva === p.ID_PARQUEO}
								onClick={() => setFilaActiva(filaActiva === p.ID_PARQUEO ? null : p.ID_PARQUEO)}
							>
								<Celda mono>{p.ID_PARQUEO}</Celda>
								<Celda>{p.NUMERO_PARQUEO}</Celda>
								<Celda>{p.DESCRIPCION}</Celda>
								<Celda>{p.NUMERO_PROPIEDAD}</Celda>
								<Celda>
									<Etiqueta
										texto={p.ACTIVO === 1 ? 'ACTIVO' : 'INACTIVO'}
										variante={p.ACTIVO === 1 ? 'activo' : 'inactivo'}
									/>
								</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(p)} Icono={Eye} titulo="Ver" />
										{esAdmin && (
											<>
												<BtnAccion onClick={() => abrirEditar(p)} Icono={Pencil} titulo="Editar" />
												<BtnAccion
													onClick={() => setAEliminar(p)}
													Icono={Trash2}
													titulo="Eliminar"
													colorHover="hover:text-red-400"
												/>
											</>
										)}
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={parqueos.length} unidad="parqueos" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Parqueo' : 'Editar Parqueo'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Propiedad">
								<Selector
									required
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									{propiedades.map((p) => (
										<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>
											{p.NUMERO_PROPIEDAD}
										</option>
									))}
								</Selector>
							</Campo>
							<Campo etiqueta="Numero de parqueo">
								<input
									type="text"
									required
									value={form.numeroParqueo}
									onChange={(e) => setForm({ ...form, numeroParqueo: e.target.value })}
									placeholder="Ej: P-101"
									className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
								/>
							</Campo>
						</div>
						<Campo etiqueta="Descripción">
							<textarea
								required
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Ej: Parqueo techado en sótano 1"
								rows={3}
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
							/>
						</Campo>
						<Campo etiqueta="Estado">
							<br />
							<div className="estado-container">
								<label className={`estado-opcion ${form.activo === 1 ? 'activo-seleccionado' : ''}`}>
									<input
										type="radio"
										name="activo"
										checked={form.activo === 1}
										onChange={() => setForm({ ...form, activo: 1 })}
									/>

									<span className="estado-dot"></span>
									<span>Activo</span>
								</label>

								<label className={`estado-opcion ${form.activo === 0 ? 'inactivo-seleccionado' : ''}`}>
									<input
										type="radio"
										name="activo"
										checked={form.activo === 0}
										onChange={() => setForm({ ...form, activo: 0 })}
									/>

									<span className="estado-dot"></span>
									<span>Inactivo</span>
								</label>

								<style jsx>{`
									.estado-container {
										display: flex;
										gap: 14px;
										margin-top: 10px;
									}

									.estado-opcion {
										display: flex;
										align-items: center;
										gap: 8px;

										padding: 10px 18px;
										border-radius: 999px;

										background: #23232b;
										border: 1px solid #3a3a46;

										color: #b8b8c2;
										font-size: 14px;
										font-weight: 600;

										cursor: pointer;
										transition: all 0.2s ease;

										user-select: none;
									}

									/* OCULTAR RADIO ORIGINAL */
									.estado-opcion input[type='radio'] {
										display: none;
									}

									.estado-dot {
										width: 10px;
										height: 10px;
										border-radius: 50%;
										background: #777;

										transition: all 0.2s ease;
									}

									/* HOVER */
									.estado-opcion:hover {
										transform: translateY(-1px);
										border-color: #555;
									}

									/* ACTIVO */
									.activo-seleccionado {
										background: rgba(0, 255, 140, 0.12);
										border-color: rgba(0, 255, 140, 0.4);
										color: #61ffb0;

										box-shadow: 0 0 12px rgba(0, 255, 140, 0.15);
									}

									.activo-seleccionado .estado-dot {
										background: #00ff88;
										box-shadow: 0 0 10px #00ff88;
									}

									/* INACTIVO */
									.inactivo-seleccionado {
										background: rgba(255, 90, 90, 0.12);
										border-color: rgba(255, 90, 90, 0.4);
										color: #ff9090;

										box-shadow: 0 0 12px rgba(255, 90, 90, 0.12);
									}

									.inactivo-seleccionado .estado-dot {
										background: #ff5a5a;
										box-shadow: 0 0 10px #ff5a5a;
									}
								`}</style>
							</div>
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
				<Modal titulo="Detalle del Parqueo" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['#', seleccion.ID_PARQUEO],
							['No. Parqueo', seleccion.NUMERO_PARQUEO],
							['No. Propiedad', seleccion.NUMERO_PROPIEDAD],
							['Descripcion', seleccion.DESCRIPCION],
							['Estado', seleccion.ACTIVO],
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
					titulo="¿Eliminar parqueo?"
					mensaje={`Se eliminará el parqueo "${aEliminar.NUMERO_PARQUEO}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
