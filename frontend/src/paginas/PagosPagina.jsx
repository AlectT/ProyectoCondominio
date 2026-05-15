// ============================================================
// 📁 RUTA: frontend/src/paginas/PagosPagina.jsx
// ============================================================
import { useState, useEffect, useRef } from 'react';
import {
	Plus,
	Eye,
	CreditCard,
	CheckCircle,
	Clock,
	Receipt,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Wallet,
} from 'lucide-react';
import { usePagos } from '../hooks/usePagos.js';
import { pagosApi } from '../api/pagosApi.js';
import { propiedadesApi } from '../api/propiedadesApi.js';
import { TarjetaMetrica, Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada } from '../componentes/ui/Formularios.jsx';
import { formatearFecha } from '../utilidades/formatearFecha.js';
import { extraerError } from '../utilidades/extraerError.js';
import useStore from '../estado/useStore.js';
import { toast } from 'sonner';

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';
const formatQ = (monto) => `Q${Number(monto ?? 0).toFixed(2)}`;

export default function PagosPagina({ filtroGlobal = '' }) {
	const usuario = useStore((s) => s.usuario);
	const esAdmin = usuario?.ROL === 'Administrador';

	const {
		pagos,
		estadoCuenta,
		cargando,
		cargandoEstado,
		error,
		cargarPagos,
		cargarEstadoCuenta,
		crear,
	} = usePagos();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'crear' | 'ver'
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [detalleExpandido, setDetalleExpandido] = useState(null);
	const [pagoDetalle, setPagoDetalle] = useState(null);
	const [cargandoDetalle, setCargandoDetalle] = useState(false);

	const debounceRef = useRef(null);
	const [propiedades, setPropiedades] = useState([]);
	const [cargandoPropiedades, setCargandoPropiedades] = useState(false);

	useEffect(() => {
		if (modal === 'crear' && esAdmin) {
			const obtenerPropiedades = async () => {
				setCargandoPropiedades(true);
				try {
					// Usamos tu API con Axios
					const res = await propiedadesApi.obtenerTodas();
					// Axios encapsula la respuesta en ".data"
					setPropiedades(res.data);
				} catch (err) {
					toast.error('Error al cargar propiedades');
				} finally {
					setCargandoPropiedades(false);
				}
			};
			obtenerPropiedades();
		}
	}, [modal, esAdmin]);

	const [form, setForm] = useState({
		idPropiedad: '',
		numeroBoleta: '',
		observaciones: '',
	});

	useEffect(() => {
		if (modal !== 'crear') return;
		clearTimeout(debounceRef.current);
		if (!form.idPropiedad) {
			cargarEstadoCuenta(null);
			return;
		}
		debounceRef.current = setTimeout(() => {
			cargarEstadoCuenta(form.idPropiedad);
		}, 500);
		return () => clearTimeout(debounceRef.current);
	}, [form.idPropiedad, modal]);

	const abrirCrear = () => {
		setForm({ idPropiedad: '', numeroBoleta: '', observaciones: '' });
		setErrorModal('');
		if (!esAdmin) cargarEstadoCuenta();
		setModal('crear');
	};

	const abrirVer = async (pago) => {
		setSeleccion(pago);
		setPagoDetalle(null);
		setCargandoDetalle(true);
		setModal('ver');
		try {
			const res = await pagosApi.obtenerPorId(pago.ID_PAGO);
			setPagoDetalle(res.data);
		} catch {
			setPagoDetalle(null);
		} finally {
			setCargandoDetalle(false);
		}
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');

		if (estadoCuenta && estadoCuenta.cantidadCargosPendientes === 0) {
			setErrorModal('Esta propiedad no tiene cargos pendientes.');
			toast.error('Esta propiedad no tiene cargos pendientes.');
			return;
		}

		try {
			const datos = {
				idPropiedad: esAdmin ? Number(form.idPropiedad) : undefined,
				numeroBoleta: form.numeroBoleta.trim(),
				observaciones: form.observaciones.trim() || undefined,
			};
			if (!esAdmin) delete datos.idPropiedad;

			await crear(
				esAdmin ? datos : { numeroBoleta: datos.numeroBoleta, observaciones: datos.observaciones },
			);
			setModal(null);
			cargarPagos();
			toast.success('Pago registrado exitosamente');
		} catch (err) {
			const msj = extraerError(err) || 'Error al registrar el pago';
			setErrorModal(msj);
			toast.error(msj);
		}
	};

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = termino
		? pagos.filter(
				(p) =>
					limpiar(p.NUMERO_BOLETA).includes(termino) ||
					limpiar(p.NUMERO_PROPIEDAD).includes(termino) ||
					limpiar(p.NOMBRE_USUARIO).includes(termino) ||
					limpiar(p.MONTO_TOTAL?.toString()).includes(termino),
			)
		: pagos;

	const totalPagado = pagos.reduce((acc, p) => acc + Number(p.MONTO_TOTAL ?? 0), 0);
	const pagosEsteMes = pagos.filter((p) => {
		const fecha = new Date(p.FECHA_PAGO);
		const ahora = new Date();
		return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
	}).length;

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
								Cargando pagos
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
					etiqueta="Total pagos"
					valor={pagos.length}
					Icono={Receipt}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Este mes"
					valor={pagosEsteMes}
					Icono={Clock}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Monto total"
					valor={formatQ(totalPagado)}
					Icono={Wallet}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Recaudado hoy"
					valor={formatQ(
						pagos
							.filter((p) => {
								const f = new Date(p.FECHA_PAGO);
								const h = new Date();
								return (
									f.getDate() === h.getDate() &&
									f.getMonth() === h.getMonth() &&
									f.getFullYear() === h.getFullYear()
								);
							})
							.reduce((acc, p) => acc + Number(p.MONTO_TOTAL ?? 0), 0),
					)}
					Icono={CreditCard}
					fondo="bg-violet-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<div className="flex gap-2">
						{esAdmin && (
							<button
								onClick={async () => {
									if (
										window.confirm(
											'¿Estás seguro de generar el cobro mensual para TODAS las propiedades activas?',
										)
									) {
										try {
											await propiedadesApi.generarCuotasMensuales();
											toast.success('Cuotas mensuales generadas exitosamente');
											cargarPagos();
										} catch (e) {
											toast.error('Error al generar las cuotas');
										}
									}
								}}
								className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition-colors border border-amber-400/20 rounded-lg"
							>
								<Clock className="w-4 h-4" /> Generar Cuotas
							</button>
						)}
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Registrar Pago
						</BtnPrimario>
					</div>
				</div>

				<table className="w-full">
					<CabeceraTabla
						columnas={
							esAdmin
								? ['#', 'Boleta', 'Propiedad', 'Residente', 'Monto', 'Fecha', 'Acciones']
								: ['#', 'Boleta', 'Propiedad', 'Monto', 'Fecha', 'Acciones']
						}
					/>
					<tbody>
						{filtrados.length === 0 ? (
							<tr>
								<td
									colSpan={esAdmin ? 7 : 6}
									className="px-4 py-10 text-center text-secundario text-sm"
								>
									No hay pagos registrados.
								</td>
							</tr>
						) : (
							filtrados.map((p) => (
								<Fila
									key={p.ID_PAGO}
									seleccionada={filaActiva === p.ID_PAGO}
									onClick={() => setFilaActiva(filaActiva === p.ID_PAGO ? null : p.ID_PAGO)}
								>
									<Celda mono>{p.ID_PAGO}</Celda>
									<Celda mono>{p.NUMERO_BOLETA}</Celda>
									<Celda>{p.NUMERO_PROPIEDAD ?? `#${p.ID_PROPIEDAD}`}</Celda>
									{esAdmin && <Celda>{p.NOMBRE_USUARIO ?? '—'}</Celda>}
									<Celda>
										<span className="text-emerald-400 font-bold font-mono">
											{formatQ(p.MONTO_TOTAL)}
										</span>
									</Celda>
									<Celda>{formatearFecha(p.FECHA_PAGO)}</Celda>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
											<BtnAccion onClick={() => abrirVer(p)} Icono={Eye} titulo="Ver detalle" />
										</div>
									</td>
								</Fila>
							))
						)}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={pagos.length} unidad="pagos" />
			</div>

			{modal === 'crear' && (
				<Modal titulo="Registrar Pago" alCerrar={() => setModal(null)}>
					<form onSubmit={guardar} className="space-y-5">
						{esAdmin && (
							<Campo etiqueta="Seleccionar Propiedad">
								<select
									className="w-full bg-fondo border border-borde rounded-lg px-3 py-2 text-sm text-primario focus:border-emerald-500 outline-none"
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}
									required
								>
									<option value="">
										{cargandoPropiedades ? 'Cargando...' : 'Seleccione una propiedad'}
									</option>
									{propiedades.map((p) => (
										<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>
											Propiedad {p.NUMERO_PROPIEDAD}
										</option>
									))}
								</select>
							</Campo>
						)}

						<div className="rounded-xl border border-borde bg-fondo overflow-hidden">
							<div className="px-4 py-3 border-b border-borde bg-tarjeta/50 flex items-center gap-2">
								<AlertCircle className="w-4 h-4 text-amber-400" />
								<span className="text-[11px] font-bold uppercase tracking-wide text-secundario">
									Cargos pendientes
								</span>
							</div>

							{cargandoEstado ? (
								<div className="px-4 py-6 text-center text-secundario text-sm">
									Consultando cargos...
								</div>
							) : !estadoCuenta ? (
								<div className="px-4 py-6 text-center text-zinc-600 text-sm">
									{esAdmin
										? 'Ingresa un ID de propiedad para ver los cargos pendientes.'
										: 'No se pudieron cargar los cargos pendientes.'}
								</div>
							) : estadoCuenta.cantidadCargosPendientes === 0 ? (
								<div className="px-4 py-6 text-center space-y-2">
									<CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
									<p className="text-emerald-400 text-sm font-medium">Sin cargos pendientes</p>
									<p className="text-zinc-600 text-xs">Esta propiedad está al día.</p>
								</div>
							) : (
								<div>
									<div className="divide-y divide-borde">
										{estadoCuenta.cargosPendientes.map((cargo) => (
											<div key={cargo.ID_CARGO} className="flex items-center justify-between px-4 py-3">
												<div>
													<p className="text-sm text-primario font-medium">{cargo.DESCRIPCION}</p>
													<p className="text-[11px] text-zinc-500 mt-0.5">
														{cargo.TIPO_CARGO}
														{cargo.FECHA_EMISION ? ` · ${formatearFecha(cargo.FECHA_EMISION)}` : ''}
													</p>
												</div>
												<span
													className={`text-sm font-bold font-mono ${
														cargo.ES_MULTA ? 'text-red-400' : 'text-primario'
													}`}
												>
													{formatQ(cargo.MONTO)}
												</span>
											</div>
										))}
									</div>

									<div className="flex items-center justify-between px-4 py-3 bg-tarjeta/50 border-t border-borde">
										<span className="text-[12px] font-bold uppercase tracking-wide text-secundario">
											Total a pagar
										</span>
										<span className="text-lg font-bold font-mono text-emerald-400">
											{formatQ(estadoCuenta.totalPendiente)}
										</span>
									</div>

									{estadoCuenta.ultimoPago && (
										<div className="px-4 py-2 bg-fondo border-t border-borde">
											<p className="text-[11px] text-zinc-600">
												Último pago:{' '}
												<span className="text-zinc-400">
													{estadoCuenta.ultimoPago.NUMERO_BOLETA} —{' '}
													{formatearFecha(estadoCuenta.ultimoPago.FECHA_PAGO)}
												</span>
											</p>
										</div>
									)}
								</div>
							)}
						</div>

						<Campo etiqueta="Número de Boleta">
							<Entrada
								required
								placeholder="Ej: BOL-2026-001"
								value={form.numeroBoleta}
								onChange={(e) => setForm({ ...form, numeroBoleta: e.target.value })}
							/>
						</Campo>

						<Campo etiqueta="Observaciones (opcional)">
							<Entrada
								placeholder="Ej: Pago en efectivo en caja"
								value={form.observaciones}
								onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
							/>
						</Campo>

						{errorModal && (
							<p className="text-red-400 text-xs flex items-center gap-1.5">
								<AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
								{errorModal}
							</p>
						)}

						<BotonesModal
							alCancelar={() => setModal(null)}
							textoGuardar="Confirmar Pago"
							IconoGuardar={CreditCard}
						/>
					</form>
				</Modal>
			)}

			{modal === 'ver' && seleccion && (
				<Modal
					titulo={`Detalle — Boleta ${seleccion.NUMERO_BOLETA}`}
					alCerrar={() => setModal(null)}
				>
					{cargandoDetalle ? (
						<div className="text-secundario text-sm text-center py-8">Cargando detalle...</div>
					) : (
						<div className="space-y-4">
							<div className="space-y-2">
								{[
									['# Pago', seleccion.ID_PAGO],
									['Boleta', seleccion.NUMERO_BOLETA],
									['Propiedad', seleccion.NUMERO_PROPIEDAD ?? `#${seleccion.ID_PROPIEDAD}`],
									esAdmin ? ['Residente', seleccion.NOMBRE_USUARIO ?? '—'] : null,
									['Fecha', formatearFecha(seleccion.FECHA_PAGO)],
									['Observaciones', seleccion.OBSERVACIONES ?? '—'],
								]
									.filter(Boolean)
									.map(([lbl, val]) => (
										<div key={lbl} className="flex justify-between border-b border-borde pb-2 text-sm">
											<span className="text-secundario">{lbl}</span>
											<span className="text-primario font-medium">{val}</span>
										</div>
									))}
							</div>

							<div className="rounded-xl border border-borde overflow-hidden">
								<div className="px-4 py-2.5 bg-tarjeta/50 border-b border-borde">
									<span className="text-[11px] font-bold uppercase tracking-wide text-secundario">
										Cargos cubiertos
									</span>
								</div>
								{pagoDetalle?.detalles?.length > 0 ? (
									<div className="divide-y divide-borde">
										{pagoDetalle.detalles.map((d) => (
											<div key={d.ID_DETALLE} className="flex items-center justify-between px-4 py-3">
												<div>
													<p className="text-sm text-primario">{d.DESCRIPCION_CARGO}</p>
													<p className="text-[11px] text-zinc-500">{d.TIPO_CARGO}</p>
												</div>
												<span className="text-sm font-bold font-mono text-emerald-400">
													{formatQ(d.MONTO_APLICADO)}
												</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-secundario text-sm text-center py-4">Sin detalles disponibles.</p>
								)}

								<div className="flex justify-between px-4 py-3 bg-tarjeta/50 border-t border-borde">
									<span className="text-[12px] font-bold uppercase tracking-wide text-secundario">
										Total pagado
									</span>
									<span className="text-base font-bold font-mono text-emerald-400">
										{formatQ(seleccion.MONTO_TOTAL)}
									</span>
								</div>
							</div>
						</div>
					)}
				</Modal>
			)}
		</div>
	);
}
