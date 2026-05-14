// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloTiposCargo.jsx
// ============================================================
import { useEffect, useMemo, useState } from 'react';
import { Layers, ShieldAlert, Coins, CheckCircle, Plus, Eye, Pencil, Ban } from 'lucide-react';
import { tiposCargoApi } from '../../api/tiposCargo.js';
import { limpiarBusqueda } from '../../datos/datosDePrueba.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloTiposCargo({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState([]);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [cargando, setCargando] = useState(true);
	const [guardando, setGuardando] = useState(false);

	const [form, setForm] = useState({
		nombre: '',
		descripcion: '',
		monto: 0,
		esMulta: 0,
	});

	useEffect(() => {
		cargarTiposCargo();
	}, []);

	async function cargarTiposCargo() {
		try {
			setCargando(true);
			const respuesta = await tiposCargoApi.obtenerTodos();
			setDatos(respuesta.data);
		} catch (error) {
			console.error('Error al cargar tipos de cargo:', error);
			toast.error('No se pudieron cargar los tipos de cargo.');
		} finally {
			setCargando(false);
		}
	}

	const termino = limpiarBusqueda(busqueda || filtroGlobal);

	const filtrados = useMemo(() => {
		if (!termino) return datos;

		return datos.filter(
			(t) =>
				limpiarBusqueda(t.NOMBRE).includes(termino) ||
				limpiarBusqueda(t.DESCRIPCION).includes(termino),
		);
	}, [datos, termino]);

	function abrirNuevo() {
		setForm({
			nombre: '',
			descripcion: '',
			monto: 0,
			esMulta: 0,
		});
		setEditandoId(null);
		setModal('nuevo');
	}

	function abrirEditar(tipo) {
		setForm({
			nombre: tipo.NOMBRE ?? '',
			descripcion: tipo.DESCRIPCION ?? '',
			monto: Number(tipo.MONTO ?? 0),
			esMulta: Number(tipo.ES_MULTA ?? 0),
		});
		setEditandoId(tipo.ID_TIPO_CARGO);
		setModal('nuevo');
	}

	async function guardarTipoCargo(e) {
		e.preventDefault();

		try {
			setGuardando(true);

			const payload = {
				nombre: form.nombre.trim(),
				descripcion: form.descripcion.trim(),
				monto: Number(form.monto),
				esMulta: Number(form.esMulta),
			};

			if (editandoId) {
				await tiposCargoApi.actualizar(editandoId, payload);
				toast.success('Tipo de cargo actualizado exitosamente');
			} else {
				await tiposCargoApi.crear(payload);
				toast.success('Tipo de cargo creado exitosamente');
			}

			await cargarTiposCargo();
			setModal(null);
			setEditandoId(null);
		} catch (error) {
			console.error('Error al guardar tipo de cargo:', error);
			toast.error(error?.response?.data?.mensaje || 'No se pudo guardar el tipo de cargo.');
		} finally {
			setGuardando(false);
		}
	}

	async function toggleEstado(tipo) {
		try {
			if (tipo.ACTIVO === 1) {
				await tiposCargoApi.desactivar(tipo.ID_TIPO_CARGO);
			} else {
				await tiposCargoApi.actualizar(tipo.ID_TIPO_CARGO, { activo: 1 });
			}

			await cargarTiposCargo();
			toast.success('Estado actualizado correctamente');
		} catch (error) {
			console.error('Error al cambiar estado:', error);
			toast.error('No se pudo cambiar el estado.');
		}
	}

	const total = datos.length;
	const multas = datos.filter((t) => t.ES_MULTA === 1).length;
	const dinamicos = datos.filter((t) => t.ES_MULTA === 0).length;
	const activos = datos.filter((t) => t.ACTIVO === 1).length;

	if (cargando) {
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
								Cargando tipos de cargo
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
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total conceptos"
					valor={total}
					Icono={Layers}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Multas"
					valor={multas}
					Icono={ShieldAlert}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Dinámicos"
					valor={dinamicos}
					Icono={Coins}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={activos}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirNuevo}>
						<Plus className="w-4 h-4" /> Nuevo Tipo de Cargo
					</BtnPrimario>
				</div>

				<table className="w-full">
					<CabeceraTabla
						columnas={['Nombre', 'Descripción', 'Monto', 'Tipo', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((tipo, i) => (
							<Fila
								key={tipo.ID_TIPO_CARGO}
								indice={i}
								seleccionada={filaActiva === tipo.ID_TIPO_CARGO}
								onClick={() =>
									setFilaActiva(filaActiva === tipo.ID_TIPO_CARGO ? null : tipo.ID_TIPO_CARGO)
								}
							>
								<Celda mono>{tipo.NOMBRE}</Celda>
								<Celda>{tipo.DESCRIPCION || 'Sin descripción'}</Celda>
								<Celda>
									{Number(tipo.MONTO) > 0 ? `Q${Number(tipo.MONTO).toFixed(2)}` : 'Dinámico'}
								</Celda>

								<td className="px-4 py-3">
									<Etiqueta
										texto={tipo.ES_MULTA === 1 ? 'Multa' : 'Dinámico'}
										variante={tipo.ES_MULTA === 1 ? 'inactivo' : 'activo'}
									/>
								</td>

								<td className="px-4 py-3">
									<Etiqueta
										texto={tipo.ACTIVO === 1 ? 'Activo' : 'Inactivo'}
										variante={tipo.ACTIVO === 1 ? 'activo' : 'inactivo'}
									/>
								</td>

								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Eye}
											titulo="Ver detalle"
											onClick={() => {
												setSeleccion(tipo);
												setModal('detalle');
											}}
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(tipo)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Ban}
											titulo="Activar/Inactivar"
											onClick={() => toggleEstado(tipo)}
											colorHover="hover:text-amber-400"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>

				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="tipos de cargo" />
			</div>

			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Tipo de Cargo' : 'Registrar Tipo de Cargo'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardarTipoCargo} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre">
								<Entrada
									value={form.nombre}
									onChange={(e) => setForm({ ...form, nombre: e.target.value })}
									placeholder="Ej: Multa ruido excesivo"
									required
								/>
							</Campo>

							<Campo etiqueta="Tipo">
								<Selector
									value={form.esMulta}
									onChange={(e) =>
										setForm({
											...form,
											esMulta: Number(e.target.value),
										})
									}
								>
									<option value={0}>Dinámico</option>
									<option value={1}>Multa</option>
								</Selector>
							</Campo>
						</div>

						<Campo etiqueta="Descripción">
							<Entrada
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Ej: Ruido fuera de horario permitido"
							/>
						</Campo>

						<Campo etiqueta="Monto">
							<Entrada
								type="number"
								min="0"
								step="0.01"
								value={form.monto}
								onChange={(e) =>
									setForm({
										...form,
										monto: e.target.value === '' ? '' : Number(e.target.value),
									})
								}
								placeholder="Ej: 250.00"
								required
							/>
						</Campo>

						<div className="p-3 rounded-lg bg-zinc-800/60 border border-borde text-xs text-secundario space-y-1">
							<p>
								Tipo seleccionado:{' '}
								<span className="text-primario font-bold">
									{Number(form.esMulta) === 1 ? 'Multa con monto fijo' : 'Cargo dinámico'}
								</span>
							</p>
							<p>
								Comportamiento esperado:{' '}
								<span className="text-primario font-bold">
									{Number(form.esMulta) === 1
										? 'Se usará el monto del catálogo.'
										: 'El sistema podrá calcular el monto dinámicamente.'}
								</span>
							</p>
						</div>

						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={guardando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{modal === 'detalle' && seleccion && (
				<Modal titulo={`Detalle — ${seleccion.NOMBRE}`} alCerrar={() => setModal(null)}>
					<div className="space-y-0">
						{[
							['ID', seleccion.ID_TIPO_CARGO],
							['Nombre', seleccion.NOMBRE],
							['Descripción', seleccion.DESCRIPCION || 'Sin descripción'],
							[
								'Monto',
								Number(seleccion.MONTO) > 0
									? `Q${Number(seleccion.MONTO).toFixed(2)}`
									: 'Dinámico / 0.00',
							],
							['Es multa', seleccion.ES_MULTA === 1 ? 'Sí' : 'No'],
							['Estado', seleccion.ACTIVO === 1 ? 'Activo' : 'Inactivo'],
						].map(([k, v]) => (
							<div
								key={k}
								className="flex justify-between py-3 border-b border-borde/50 last:border-0"
							>
								<span className="text-xs text-secundario">{k}</span>
								<span className="text-sm font-bold text-primario">{v}</span>
							</div>
						))}
					</div>
				</Modal>
			)}
		</div>
	);
}
