// ============================================================
// 📁 RUTA: frontend/src/paginas/usuarioPropiedadPagina.jsx
// ============================================================
import { useState, useEffect } from 'react';
import {
	Plus,
	Eye,
	Pencil,
	Trash2,
	Ticket,
	Clock,
	CheckCircle,
	XCircle,
	History,
	CarFront,
	PersonStanding,
} from 'lucide-react';
import { useUsuarioPropiedad } from '../hooks/useUsuarioPropiedad.js';
import { usuariosApi } from '../api/usuariosApi.js';
import { propiedadesApi } from '../api/propiedadesApi.js';
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

export default function UsuarioPropiedadPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { up, cargando, error, crear, actualizar, eliminar } = useUsuarioPropiedad();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [personal, setPersonal] = useState([]);
	const [propiedades, setPropiedades] = useState([]);

	useEffect(() => {
		usuariosApi
			.obtenerTodos()
			.then((res) => {
				const filtrados = res.data.filter((u) => u.ROL !== 'Residente' && u.ACTIVO === 1);
				setPersonal(filtrados);
			})
			.catch(() => setPersonal([]));

		propiedadesApi
			.obtenerTodas()
			.then((res) => {
				setPropiedades(res.data);
			})
			.catch(() => setPropiedades([]));
	}, []);

	// console.log(propiedades);
	const [form, setForm] = useState({
		idUsuario: '',
		idPropiedad: '',
		tipoVinculo: '',
		fechaFin: '',
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? up.filter(
				(p) =>
					limpiar(p.ID_PROPIEDAD).includes(termino) || limpiar(p.ID_USUARIO).includes(termino),
			)
		: up;

	const abrirCrear = () => {
		setForm({
			idUsuario: '',
			idPropiedad: '',
			tipoVinculo: '',
			fechaFin: '',
		});
		setErrorModal('');
		setModal('crear');
	};

	const abrirEditar = (p) => {
		setSeleccion(p);
		setForm({
			idUsuario: p.ID_USUARIO,
			idPropiedad: p.ID_PROPIEDAD,
			tipoVinculo: p.TIPO_VINCULO,
			fechaFin: p.FECHA_FIN,
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
			const fecha = form.fechaFin;
			const [anio, mes, dia] = fecha.split('-');
			const fechaFormateada = `${dia}-${mes}-${anio}`;
			const datosAEnviar = {
				...form,
				idUsuario: Number(form.idUsuario),
				idPropiedad: Number(form.idPropiedad),
				tipoVinculo: form.tipoVinculo,
				fechaFin: fechaFormateada,
			};

			console.log(datosAEnviar);

			if (modal === 'crear') {
				await crear(datosAEnviar);
				toast.success('Vínculo creado exitosamente');
			} else {
				await actualizar(seleccion.ID_USUARIO_PROPIEDAD, datosAEnviar);
				toast.success('Vínculo actualizado exitosamente');
			}
			setModal(null);
		} catch (err) {
			const msj = extraerError(err) || 'Error al guardar el vínculo';
			setErrorModal(msj);
			toast.error(msj);
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_USUARIO_PROPIEDAD);
			toast.success('Vínculo eliminado exitosamente');
		} catch (err) {
			const msj = extraerError(err) || 'Error al eliminar el vínculo';
			console.error('Error al eliminar el vínculo:', msj);
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
								Cargando Relaciones
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
				<TarjetaMetrica etiqueta="Total" valor={up.length} Icono={CarFront} fondo="bg-zinc-800" />
				<TarjetaMetrica
					etiqueta="Propietarios"
					valor={up.filter((p) => p.TIPO_VINCULO === 'Propietario').length}
					Icono={PersonStanding}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inquilino"
					valor={up.filter((p) => p.TIPO_VINCULO === 'Inquilino').length}
					Icono={PersonStanding}
					fondo="bg-zinc-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					{esAdmin && (
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nuevo Propietario / Inquilino
						</BtnPrimario>
					)}
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['#', 'No. Usuario', 'No. Propiedad', 'Vínculo', 'Duración', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((up) => (
							<Fila
								key={up.ID_USUARIO_PROPIEDAD}
								seleccionada={filaActiva === up.ID_USUARIO_PROPIEDAD}
								onClick={() =>
									setFilaActiva(filaActiva === up.ID_USUARIO_PROPIEDAD ? null : up.ID_USUARIO_PROPIEDAD)
								}
							>
								<Celda mono>{up.ID_USUARIO_PROPIEDAD}</Celda>
								<Celda>{up.ID_USUARIO}</Celda>
								<Celda>{up.ID_PROPIEDAD}</Celda>
								<Celda>{up.TIPO_VINCULO}</Celda>
								<Celda>{formatearFecha(up.FECHA_FIN)}</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(up)} Icono={Eye} titulo="Ver" />
										{esAdmin && (
											<>
												<BtnAccion onClick={() => abrirEditar(up)} Icono={Pencil} titulo="Editar" />
												<BtnAccion
													onClick={() => setAEliminar(up)}
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
				<PieTabla mostrados={filtrados.length} total={up.length} unidad="up" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Vinculo' : 'Editar Vinculo'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Usuario">
								<Selector
									required
									value={form.idUsuario}
									onChange={(e) => setForm({ ...form, idUsuario: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									{personal.map((u) => (
										<option key={u.ID_USUARIO} value={u.ID_USUARIO}>
											{u.NOMBRE_USUARIO} — {u.NOMBRE} {u.APELLIDO} ({u.ROL})
										</option>
									))}
								</Selector>
							</Campo>
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
							<Campo etiqueta="Tipo de Vinculo">
								<Selector
									required
									value={form.tipoVinculo}
									onChange={(e) => setForm({ ...form, tipoVinculo: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									<option value="Propietario">Propietario</option>
									<option value="Inquilino">Inquilino</option>
								</Selector>
							</Campo>
							<Campo etiqueta="Fecha Fin">
								<input
									type="date"
									required
									value={form.fechaFin}
									onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
									className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
								/>
							</Campo>
						</div>
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
							['#', seleccion.ID_USUARIO_PROPIEDAD],
							['No. Usuario', seleccion.ID_USUARIO],
							['No. Propiedad', seleccion.ID_PROPIEDAD],
							['Tipo de Vínculo', seleccion.TIPO_VINCULO],
							['Fecha de Pago', formatearFecha(seleccion.FECHA_FIN)],
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
					titulo="¿Eliminar vinculo de propiedad?"
					mensaje={`Se eliminará el vinculo "${aEliminar.ID_USUARIO_PROPIEDAD}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
