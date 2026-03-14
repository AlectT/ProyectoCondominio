import { useState } from 'react';
import {
	Building,
	CheckCircle,
	Users,
	Plus,
	Eye,
	Pencil,
	Ban,
	Trash2,
	Car,
	Tag,
	RefreshCw,
	QrCode,
	Clock,
	Save,
	AlertTriangle,
	Zap,
} from 'lucide-react';
import {
	propiedadesEjemplo,
	vehiculosEjemplo,
	invitacionesEjemplo,
	multasEjemplo,
	limpiarBusqueda,
	colorVehiculo,
} from '../../datos/datosDePrueba.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../../componentes/ui/Formularios.jsx';
export default function ModuloPropiedades({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(propiedadesEjemplo);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [form, setForm] = useState({
		numero: '',
		categoria: 'Básica',
		propietario: '',
		inquilino: '',
	});

	const cuotaPorCategoria = { Básica: 500, Intermedia: 800, Completa: 1200 };
	const parqueosPorCategoria = { Básica: 1, Intermedia: 2, Completa: 3 };
	const colorCategoria = {
		Básica: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
		Intermedia: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
		Completa: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
	};

	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(p) =>
					limpiarBusqueda(p.numero).includes(termino) ||
					limpiarBusqueda(p.propietario).includes(termino) ||
					(p.inquilino && limpiarBusqueda(p.inquilino).includes(termino)),
			)
		: datos;

	function guardarNuevo(e) {
		if (e) e.preventDefault();
		if (!form.numero.trim() || !form.propietario.trim()) return;
		if (editandoId) {
			setDatos(
				datos.map((d) =>
					d.id === editandoId
						? {
								...d,
								numero: form.numero.trim().toUpperCase(),
								categoria: form.categoria,
								cuota: cuotaPorCategoria[form.categoria],
								parqueos: parqueosPorCategoria[form.categoria],
								propietario: form.propietario,
								inquilino: form.inquilino.trim() ? form.inquilino : null,
							}
						: d,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					numero: form.numero.trim().toUpperCase(),
					categoria: form.categoria,
					cuota: cuotaPorCategoria[form.categoria],
					parqueos: parqueosPorCategoria[form.categoria],
					propietario: form.propietario,
					inquilino: form.inquilino.trim() ? form.inquilino : null,
					estado: 'Activo',
				},
			]);
		}
		setModal(null);
		setEditandoId(null);
	}

	function abrirEditar(p) {
		setForm({
			numero: p.numero,
			categoria: p.categoria,
			propietario: p.propietario,
			inquilino: p.inquilino || '',
		});
		setEditandoId(p.id);
		setModal('nuevo');
	}

	function toggleEstado(id) {
		setDatos(
			datos.map((p) =>
				p.id === id ? { ...p, estado: p.estado === 'Activo' ? 'Inactivo' : 'Activo' } : p,
			),
		);
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Unidades"
					valor={datos.length}
					Icono={Building}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activas"
					valor={datos.filter((p) => p.estado === 'Activo').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Con Inquilino"
					valor={datos.filter((p) => p.inquilino).length}
					Icono={Users}
					fondo="bg-sky-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Cuota promedio"
					valor={`Q${Math.round(datos.reduce((s, p) => s + p.cuota, 0) / datos.length)}`}
					textoIcono="Q"
					fondo="bg-amber-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ numero: '', categoria: 'Básica', propietario: '', inquilino: '' });
							setEditandoId(null);
							setModal('nuevo');
						}}
					>
						<Plus className="w-4 h-4" /> Registrar Propiedad
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={['Número', 'Categoría', 'Cuota', 'Usuarios Registrados', 'Estado', 'Acciones']}
					/>
					<tbody>
						{filtrados.map((p, i) => (
							<Fila
								key={p.id}
								indice={i}
								seleccionada={filaActiva === p.id}
								onClick={() => setFilaActiva(filaActiva === p.id ? null : p.id)}
							>
								<Celda mono>{p.numero}</Celda>
								<td className="px-4 py-3">
									<span
										className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${colorCategoria[p.categoria]}`}
									>
										{p.categoria}
									</span>
								</td>
								<Celda>Q{p.cuota.toFixed(2)}</Celda>
								<td className="px-4 py-3">
									<div className="text-xs">
										<div className="flex items-center gap-1.5 mb-1">
											<span className="text-zinc-500 w-4">P:</span>
											<span className={!p.inquilino ? 'text-primario font-bold' : 'text-zinc-400'}>
												{p.propietario}
											</span>
											{!p.inquilino && (
												<span className="ml-1 text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded border border-emerald-500/20">
													Responsable Pago
												</span>
											)}
										</div>
										{p.inquilino && (
											<div className="flex items-center gap-1.5">
												<span className="text-zinc-500 w-4">I:</span>
												<span className="text-primario font-bold">{p.inquilino}</span>
												<span className="ml-1 text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded border border-emerald-500/20">
													Responsable Pago
												</span>
											</div>
										)}
									</div>
								</td>
								<td className="px-4 py-3">
									<Etiqueta texto={p.estado} variante={p.estado.toLowerCase()} />
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Eye}
											titulo="Ver detalle"
											onClick={() => {
												setSeleccion(p);
												setModal('detalle');
											}}
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(p)}
											colorHover="hover:text-blue-400"
										/>
										<BtnAccion
											Icono={Ban}
											titulo="Activar/Inactivar"
											onClick={() => toggleEstado(p.id)}
											colorHover="hover:text-amber-400"
										/>
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar propiedad"
											onClick={() => setAEliminar(p)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="propiedades" />
			</div>

			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Propiedad' : 'Registrar Propiedad'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={guardarNuevo} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Número de propiedad">
								<Entrada
									value={form.numero}
									onChange={(e) => setForm({ ...form, numero: e.target.value })}
									placeholder="Ej: A-101"
									required
								/>
							</Campo>
							<Campo etiqueta="Categoría">
								<Selector
									value={form.categoria}
									onChange={(e) => setForm({ ...form, categoria: e.target.value })}
								>
									<option>Básica</option>
									<option>Intermedia</option>
									<option>Completa</option>
								</Selector>
							</Campo>
						</div>
						<Campo etiqueta="Nombre del Propietario (Obligatorio)">
							<Entrada
								value={form.propietario}
								onChange={(e) => setForm({ ...form, propietario: e.target.value })}
								placeholder="Nombre completo"
								required
							/>
						</Campo>
						<Campo etiqueta="Nombre del Inquilino (Opcional)">
							<Entrada
								value={form.inquilino}
								onChange={(e) => setForm({ ...form, inquilino: e.target.value })}
								placeholder="Dejar en blanco si no hay"
							/>
						</Campo>
						<div className="p-3 rounded-lg bg-zinc-800/60 border border-borde text-xs text-secundario space-y-1">
							<p>
								Cuota a cobrar:{' '}
								<span className="text-primario font-bold">
									Q{cuotaPorCategoria[form.categoria]}.00
								</span>
							</p>
							<p>
								Parqueos asignados:{' '}
								<span className="text-primario font-bold">{parqueosPorCategoria[form.categoria]}</span>
							</p>
						</div>
						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Guardar'}
						/>
					</form>
				</Modal>
			)}

			{modal === 'detalle' && seleccion && (
				<Modal titulo={`Detalle — ${seleccion.numero}`} alCerrar={() => setModal(null)}>
					<div className="space-y-0">
						{[
							['Número', seleccion.numero],
							['Categoría', seleccion.categoria],
							['Cuota', `Q${seleccion.cuota.toFixed(2)} / mes`],
							['Parqueos', seleccion.parqueos],
							['Propietario', seleccion.propietario],
							['Inquilino', seleccion.inquilino || 'No aplica'],
							['Estado', seleccion.estado],
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

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Propiedad?"
					mensaje={`Borrando la propiedad ${aEliminar.numero}. Esta acción no se puede deshacer.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={() => {
						setDatos(datos.filter((p) => p.id !== aEliminar.id));
						setAEliminar(null);
					}}
				/>
			)}
		</div>
	);
}

/* ============================================================
   2. CONTROL VEHICULAR
============================================================ */
