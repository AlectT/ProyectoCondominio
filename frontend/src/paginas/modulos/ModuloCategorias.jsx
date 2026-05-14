import { extraerError } from '../../utilidades/extraerError.js';
// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloCategorias.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Tags, Plus, Pencil, Trash2 } from 'lucide-react';
import { categoriasApi } from '../../api/categoriasApi.js';
import { TarjetaMetrica } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';

export default function ModuloCategorias({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'nuevo', 'editar'
	const [aEliminar, setAEliminar] = useState(null);

	const [form, setForm] = useState({
		id: null,
		nombre: '',
		descripcion: '',
		maxParqueos: 1,
		cuotaMensual: 0,
	});

	const cargarDatos = async () => {
		setCargando(true);
		try {
			const respuesta = await categoriasApi.obtenerTodas();
			const formateados = respuesta.data.map((c) => ({
				id: c.ID_CATEGORIA,
				nombre: c.NOMBRE,
				descripcion: c.DESCRIPCION,
				maxParqueos: c.MAX_PARQUEOS,
				cuotaMensual: c.CUOTA_MENSUAL,
			}));
			setDatos(formateados);
		} catch (error) {
			console.error('Error al cargar categorías:', error);
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		cargarDatos();
	}, []);

	const termino = (busqueda || filtroGlobal).toLowerCase().trim();
	const filtrados = termino
		? datos.filter((c) => c.nombre.toLowerCase().includes(termino))
		: datos;

	const abrirModalNuevo = () => {
		setForm({ id: null, nombre: '', descripcion: '', maxParqueos: 1, cuotaMensual: 0 });
		setModal('nuevo');
	};

	const abrirModalEditar = (cat) => {
		setForm({
			id: cat.id,
			nombre: cat.nombre,
			descripcion: cat.descripcion || '',
			maxParqueos: cat.maxParqueos,
			cuotaMensual: cat.cuotaMensual,
		});
		setModal('editar');
	};

	const guardarCategoria = async (e) => {
		e.preventDefault();
		const payload = {
			nombre: form.nombre,
			descripcion: form.descripcion,
			maxParqueos: Number(form.maxParqueos),
			cuotaMensual: Number(form.cuotaMensual),
		};

		try {
			if (form.id) {
				await categoriasApi.actualizar(form.id, payload);
				toast.success('Categoría actualizada exitosamente');
			} else {
				await categoriasApi.crear(payload);
				toast.success('Categoría creada exitosamente');
			}
			await cargarDatos();
			setModal(null);
		} catch (error) {
			const msj = extraerError(error) || 'Error al guardar la categoría.';
			toast.error(msj);
		}
	};

	const confirmarEliminar = async () => {
		try {
			await categoriasApi.eliminar(aEliminar.id);
			await cargarDatos();
			setAEliminar(null);
			toast.success('Categoría eliminada exitosamente');
		} catch (error) {
			const msj = extraerError(error) || 'Error al eliminar.';
			toast.error(msj);
		}
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
								Cargando categorías
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

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-3 gap-4">
				<TarjetaMetrica
					etiqueta="Total Categorías"
					valor={datos.length}
					Icono={Tags}
					fondo="bg-zinc-800"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirModalNuevo}>
						<Plus className="w-4 h-4" /> Nueva Categoría
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['Nombre', 'Descripción', 'Cuota Mensual', 'Máx Parqueos', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((cat, i) => (
							<Fila key={cat.id} indice={i}>
								<Celda className="font-bold text-primario">{cat.nombre}</Celda>
								<Celda className="text-zinc-400 text-xs">{cat.descripcion || 'Sin descripción'}</Celda>
								<Celda>Q{cat.cuotaMensual.toFixed(2)}</Celda>
								<Celda>{cat.maxParqueos}</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Pencil}
											onClick={() => abrirModalEditar(cat)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Trash2}
											onClick={() => setAEliminar(cat)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="categorías" />
			</div>

			{modal && (
				<Modal
					titulo={modal === 'nuevo' ? 'Nueva Categoría' : 'Editar Categoría'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardarCategoria} className="space-y-4">
						<Campo etiqueta="Nombre de Categoría">
							<Entrada
								required
								value={form.nombre}
								onChange={(e) => setForm({ ...form, nombre: e.target.value })}
								placeholder="Ej: Premium"
							/>
						</Campo>
						<Campo etiqueta="Descripción">
							<Entrada
								value={form.descripcion}
								onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
								placeholder="Breve descripción..."
							/>
						</Campo>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Cuota Mensual (Q)">
								<Entrada
									required
									type="number"
									step="0.01"
									min="1"
									value={form.cuotaMensual}
									onChange={(e) => setForm({ ...form, cuotaMensual: e.target.value })}
								/>
							</Campo>
							<Campo etiqueta="Límite de Parqueos">
								<Entrada
									required
									type="number"
									min="0"
									value={form.maxParqueos}
									onChange={(e) => setForm({ ...form, maxParqueos: e.target.value })}
								/>
							</Campo>
						</div>
						<BotonesModal alCancelar={() => setModal(null)} textoGuardar="Guardar Categoría" />
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Categoría?"
					mensaje={`Se borrará la categoría "${aEliminar.nombre}". Solo se puede eliminar si no hay propiedades usándola.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminar}
				/>
			)}
		</div>
	);
}
