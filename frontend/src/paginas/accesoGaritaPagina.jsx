// ============================================================
// 📁 RUTA: frontend/src/paginas/accesoGarita.jsx
// ============================================================
import { useState } from 'react';
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
	FileWarningIcon,
} from 'lucide-react';
import { useAccesoGarita } from '../hooks/useAccesoGarita.js';
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

export default function AccesoGaritaPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const { accesoGarita, cargando, error, crear, actualizar, eliminar } = useAccesoGarita();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	console.log(error);

	const [form, setForm] = useState({
		idInvitacion: '',
		idGuardia: '',
		tipoDocumento: '',
		numeroDocumento: '',
		nombreCompletoReal: '',
		observaciones: '',
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? accesoGarita.filter(
				(ag) =>
					limpiar(ag.ID_ACCESO).includes(termino) ||
					limpiar(ag.ID_INVITACION).includes(termino) ||
					limpiar(ag.NUMERO_DOCUMENTO?.toString()).includes(termino),
			)
		: accesoGarita;

	const abrirEditar = (ag) => {
		setSeleccion(ag);
		setForm({
			tipoDocumento: '',
			numeroDocumento: '',
			nombreCompletoReal: '',
			observaciones: '',
		});
		setErrorModal('');
		setModal('editar');
	};

	const abrirVer = (ag) => {
		setSeleccion(ag);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
		try {
			const datosAEnviar = {
				...form,
				idInvitacion: Number(form.idInvitacion),
				idGuardia: Number(form.idGuardia),
				tipoDocumento: form.tipoDocumento,
				numeroDocumento: form.numeroDocumento,
				nombreCompletoReal: form.nombreCompletoReal,
				observaciones: form.observaciones,
			};

			if (modal === 'crear') {
				await crear(datosAEnviar);
				toast.success('Acceso registrado correctamente');
			} else {
				await actualizar(seleccion.ID_ACCESO, datosAEnviar);
				toast.success('Acceso actualizado correctamente');
			}
			setModal(null);
		} catch (err) {
			const msj = extraerError(err) || 'Ocurrió un error al guardar el acceso';
			setErrorModal(msj);
			toast.error(msj);
		}
	};

	const confirmarEliminar = async () => {
		try {
			await eliminar(aEliminar.ID_ACCESO);
			toast.success('El registro se eliminó con éxito');
		} catch (err) {
			const msj = extraerError(err) || 'No se pudo eliminar el registro';
			console.error('No se pudo eliminar el registro:', msj);
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
								Cargando accesos
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
			{/* Métricas */}
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total"
					valor={accesoGarita.length}
					Icono={FileWarningIcon}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Invitaciones activas"
					valor={accesoGarita.filter((p) => p.ACTIVO === 1).length}
					Icono={Clock}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Invitaciones Inactivas"
					valor={accesoGarita.filter((p) => p.ACTIVO === 0).length}
					Icono={XCircle}
					fondo="bg-zinc-500/10"
				/>
			</div>

			{/* Tabla */}
			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'#',
							'Tipo Documento',
							'No. Documento',
							'Nombre',
							'Observaciones',
							'Hora de ingreso',
							'Fecha expiración',
							'Estado',
						]}
					/>
					<tbody>
						{filtrados.map((ag) => (
							<Fila
								key={ag.ID_ACCESO}
								seleccionada={filaActiva === ag.ID_ACCESO}
								onClick={() => setFilaActiva(filaActiva === ag.ID_ACCESO ? null : ag.ID_ACCESO)}
							>
								<Celda mono>{ag.ID_ACCESO}</Celda>
								<Celda>{ag.TIPO_DOCUMENTO}</Celda>
								<Celda>{ag.NUMERO_DOCUMENTO}</Celda>
								<Celda>{ag.NOMBRE_COMPLETO_REAL}</Celda>
								<Celda>{ag.OBSERVACIONES}</Celda>
								<Celda>{formatearFecha(ag.HORA_INGRESO)}</Celda>
								<Celda>{formatearFecha(ag.FECHA_EXPIRACION)}</Celda>
								<Celda>
									<Etiqueta texto={ag.ACTIVO === 1 ? 'ACTIVO' : 'INACTIVO'} />
								</Celda>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={accesoGarita.length} unidad="accesos" />
			</div>

			{/* Modal crear/editar */}
			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo acceso' : 'Editar acceso'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Tipo Documento">
								<Selector
									required
									value={form.tipoDocumento}
									onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}
								>
									<option value="">Seleccionar...</option>
									<option value="DPI">DPI</option>
									<option value="Licencia">Licencia</option>
								</Selector>
							</Campo>
							<Campo etiqueta="Numero Documento">
								<input
									type="text"
									required
									value={form.numeroDocumento}
									onChange={(e) => setForm({ ...form, numeroDocumento: e.target.value })}
									placeholder="Número del documento"
									className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
								/>
							</Campo>
						</div>
						<Campo etiqueta="Nombre completo">
							<input
								type="text"
								required
								value={form.nombreCompletoReal}
								onChange={(e) => setForm({ ...form, nombreCompletoReal: e.target.value })}
								placeholder="Nombre completo del invitado"
								className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
							/>
						</Campo>
						<Campo etiqueta="Observaciones">
							<input
								type="text"
								required
								value={form.observaciones}
								onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
								placeholder="Observaciones"
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

			{/* Modal ver */}
			{modal === 'ver' && seleccion && (
				<Modal titulo="Detalle del Parqueo" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['#', seleccion.ID_LLAMADO],
							['No. Invitacion', seleccion.ID_INVITACION],
							['No. Guardia', seleccion.ID_GUARDIA],
							['Nombre', seleccion.NOMBRE_COMPLETO_REAL],
							['Tipo de Documento', seleccion.TIPO_DOCUMENTO],
							['Numero de Documento', seleccion.NUMERO_DOCUMENTO],
							['Observaciones', seleccion.observaciones],
							['Hora de ingreso', formatearFecha(seleccion.HORA_INGRESO)],
							['Fecha de generación', formatearFecha(seleccion.FECHA_GENERACION)],
							['Fecha de expiracion', formatearFecha(seleccion.FECHA_EXPIRACION)],
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

			{/* Modal confirmación eliminar */}
			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar parqueo?"
					mensaje={`Se eliminará la invitación "${aEliminar.ID_INVITACION}" de forma permanente.`}
					onConfirmar={confirmarEliminar}
					onCancelar={() => setAEliminar(null)}
				/>
			)}
		</div>
	);
}
