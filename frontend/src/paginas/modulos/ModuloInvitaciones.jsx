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
export default function ModuloInvitaciones({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState(invitacionesEjemplo);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [filaActiva, setFilaActiva] = useState(null);
	const [aEliminar, setAEliminar] = useState(null);
	const [editandoId, setEditandoId] = useState(null);
	const [form, setForm] = useState({ visitante: '', tipo: 'Normal', propiedad: '' });

	const estadoVariante = {
		Activo: 'activo',
		Pendiente: 'pendiente',
		Expirado: 'expirado',
		Inactivo: 'inactivo',
		Utilizado: 'utilizado',
	};
	const termino = limpiarBusqueda(busqueda || filtroGlobal);
	const filtrados = termino
		? datos.filter(
				(inv) =>
					limpiarBusqueda(inv.propiedad).includes(termino) ||
					limpiarBusqueda(inv.visitante).includes(termino),
			)
		: datos;

	useEffect(() => {
		const hoy = new Date().toISOString().split('T')[0];
		const iv = setInterval(() => {
			setDatos((prev) => {
				const next = prev.map((inv) =>
					inv.tipo === 'Normal' &&
					(inv.estado === 'Activo' || inv.estado === 'Pendiente') &&
					inv.fecha &&
					inv.fecha < hoy
						? { ...inv, estado: 'Expirado' }
						: inv,
				);
				return JSON.stringify(next) !== JSON.stringify(prev) ? next : prev;
			});
		}, 60000);
		return () => clearInterval(iv);
	}, []);

	function crear(e) {
		if (e) e.preventDefault();
		if (!form.visitante.trim() || !form.propiedad) return;
		const propObj = propiedadesEjemplo.find((p) => p.numero === form.propiedad);
		const residente = propObj?.inquilino || propObj?.propietario || '—';
		if (editandoId) {
			setDatos(
				datos.map((inv) =>
					inv.id === editandoId
						? {
								...inv,
								visitante: form.visitante.trim(),
								tipo: form.tipo,
								residente,
								propiedad: form.propiedad,
								fecha: form.tipo === 'Normal' ? new Date().toISOString().split('T')[0] : null,
							}
						: inv,
				),
			);
		} else {
			setDatos([
				...datos,
				{
					id: Date.now(),
					visitante: form.visitante.trim(),
					tipo: form.tipo,
					residente,
					propiedad: form.propiedad,
					fecha: form.tipo === 'Normal' ? new Date().toISOString().split('T')[0] : null,
					estado: 'Pendiente',
					codigo: `QR-${Date.now()}`,
				},
			]);
		}
		setModal(null);
		setEditandoId(null);
	}

	function abrirEditar(inv) {
		setForm({ visitante: inv.visitante, tipo: inv.tipo, propiedad: inv.propiedad });
		setEditandoId(inv.id);
		setModal('nuevo');
	}

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Visitas"
					valor={datos.length}
					Icono={QrCode}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Pases Pendientes"
					valor={datos.filter((i) => i.estado === 'Pendiente').length}
					Icono={CheckCircle}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Expiradas"
					valor={datos.filter((i) => i.estado === 'Expirado').length}
					Icono={Clock}
					fondo="bg-amber-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Desactivadas / Usadas"
					valor={datos.filter((i) => i.estado === 'Inactivo' || i.estado === 'Utilizado').length}
					Icono={Ban}
					fondo="bg-red-500/10"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario
						onClick={() => {
							setForm({ visitante: '', tipo: 'Normal', propiedad: '' });
							setEditandoId(null);
							setModal('nuevo');
						}}
					>
						<Plus className="w-4 h-4" /> Generar Pase QR
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla
						columnas={[
							'Visitante',
							'Tipo',
							'Residente',
							'Propiedad',
							'Vencimiento',
							'Estado',
							'Acciones',
						]}
					/>
					<tbody>
						{filtrados.map((inv, i) => (
							<Fila
								key={inv.id}
								indice={i}
								seleccionada={filaActiva === inv.id}
								onClick={() => setFilaActiva(filaActiva === inv.id ? null : inv.id)}
							>
								<Celda>{inv.visitante}</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={inv.tipo} variante={inv.tipo.toLowerCase()} />
								</td>
								<Celda>{inv.residente}</Celda>
								<Celda mono>{inv.propiedad}</Celda>
								<Celda>
									{inv.fecha ?? (
										<span className="italic font-normal text-zinc-600">Sin vencimiento</span>
									)}
								</Celda>
								<td className="px-4 py-3">
									<Etiqueta texto={inv.estado} variante={estadoVariante[inv.estado]} />
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={QrCode}
											titulo="Ver código QR"
											onClick={() => {
												setSeleccion(inv);
												setModal('qr');
											}}
											colorHover="hover:text-sky-400"
										/>
										<BtnAccion
											Icono={Pencil}
											titulo="Editar"
											onClick={() => abrirEditar(inv)}
											colorHover="hover:text-blue-400"
										/>
										{(inv.estado === 'Pendiente' || inv.estado === 'Activo') && (
											<BtnAccion
												Icono={Ban}
												titulo="Invalidar QR"
												onClick={() =>
													setDatos(datos.map((d) => (d.id === inv.id ? { ...d, estado: 'Inactivo' } : d)))
												}
												colorHover="hover:text-amber-400"
											/>
										)}
										<BtnAccion
											Icono={Trash2}
											titulo="Eliminar registro"
											onClick={() => setAEliminar(inv)}
											colorHover="hover:text-red-500"
										/>
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="invitaciones" />
			</div>

			{modal === 'nuevo' && (
				<Modal
					titulo={editandoId ? 'Editar Pase de Visita' : 'Generar Pase de Visita'}
					alCerrar={() => {
						setModal(null);
						setEditandoId(null);
					}}
				>
					<form onSubmit={crear} className="space-y-4">
						<Campo etiqueta="Nombre del visitante">
							<Entrada
								value={form.visitante}
								onChange={(e) => setForm({ ...form, visitante: e.target.value })}
								placeholder="Nombre completo"
								required
							/>
						</Campo>
						<Campo etiqueta="Tipo de invitación">
							<Selector
								value={form.tipo}
								onChange={(e) => setForm({ ...form, tipo: e.target.value })}
							>
								<option>Normal</option>
								<option>Servicio</option>
							</Selector>
						</Campo>
						<Campo etiqueta="Propiedad que autoriza">
							<Selector
								value={form.propiedad}
								onChange={(e) => setForm({ ...form, propiedad: e.target.value })}
								required
							>
								<option value="">Seleccionar propiedad...</option>
								{propiedadesEjemplo
									.filter((p) => p.estado === 'Activo')
									.map((p) => (
										<option key={p.id} value={p.numero}>
											{p.numero} — {p.inquilino || p.propietario}
										</option>
									))}
							</Selector>
						</Campo>
						{form.tipo === 'Normal' && (
							<div className="flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
								<Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-amber-400">
									<p className="font-bold mb-1">Pase Temporal</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>Expira automáticamente a las 23:59 del día de hoy.</li>
										<li>Código QR de un solo uso (se invalida tras escanear).</li>
									</ul>
								</div>
							</div>
						)}
						{form.tipo === 'Servicio' && (
							<div className="flex gap-2 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
								<CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
								<div className="text-xs text-violet-400">
									<p className="font-bold mb-1">Pase Permanente</p>
									<ul className="list-disc pl-4 space-y-0.5 opacity-90">
										<li>No tiene fecha de caducidad.</li>
										<li>Puede utilizarse múltiples veces hasta ser desactivado manualmente.</li>
									</ul>
								</div>
							</div>
						)}
						<BotonesModal
							alCancelar={() => {
								setModal(null);
								setEditandoId(null);
							}}
							textoGuardar={editandoId ? 'Actualizar' : 'Generar QR'}
							IconoGuardar={editandoId ? Save : QrCode}
						/>
					</form>
				</Modal>
			)}

			{modal === 'qr' && seleccion && (
				<Modal titulo={`Código QR — ${seleccion.visitante}`} alCerrar={() => setModal(null)}>
					<div className="flex flex-col items-center gap-5">
						<div className="p-4 bg-white rounded-xl shadow-lg relative">
							{seleccion.estado !== 'Activo' && seleccion.estado !== 'Pendiente' && (
								<div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10">
									<span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg uppercase tracking-wider">
										{seleccion.estado}
									</span>
								</div>
							)}
							<img
								src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${window.location.origin}/garita/validar/${seleccion.codigo}`)}&color=09090b`}
								alt={`QR para ${seleccion.codigo}`}
								className="w-[160px] h-[160px] rounded-sm object-contain"
							/>
						</div>
						<p className="text-xs font-mono text-zinc-500 text-center">
							{seleccion.codigo}
							<br />
							<span className="text-[10px] opacity-70">(Escanea este QR con tu celular)</span>
						</p>
						{(seleccion.estado === 'Activo' || seleccion.estado === 'Pendiente') && (
							<button
								onClick={() => {
									setDatos(
										datos.map((d) => (d.id === seleccion.id ? { ...d, estado: 'Utilizado' } : d)),
									);
									setModal(null);
								}}
								className="mt-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-colors w-full"
							>
								Simular Escaneo en Garita (PC)
							</button>
						)}
					</div>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Eliminar Invitación?"
					mensaje={`Vas a eliminar permanentemente el registro de visita para ${aEliminar.visitante}.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={() => {
						setDatos(datos.filter((inv) => inv.id !== aEliminar.id));
						setAEliminar(null);
					}}
				/>
			)}
		</div>
	);
}

/* ============================================================
   4. INFRACCIONES Y MULTAS
============================================================ */
