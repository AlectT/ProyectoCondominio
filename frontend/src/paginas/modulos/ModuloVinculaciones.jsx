import { extraerError } from '../../utilidades/extraerError.js';
// ============================================================
// 📁 RUTA: frontend/src/paginas/modulos/ModuloVinculaciones.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { Link, Plus, Pencil, Trash2, Ban, Filter } from 'lucide-react';
import { vinculacionesApi } from '../../api/vinculacionesApi.js';
import { usuariosApi } from '../../api/usuariosApi.js';
import { propiedadesApi } from '../../api/propiedadesApi.js';
import { TarjetaMetrica, Etiqueta } from '../../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../../componentes/ui/Modales.jsx';
import { Campo, Selector } from '../../componentes/ui/Formularios.jsx';
import { toast } from 'sonner';
import Cargando from '../../componentes/ui/Cargando.jsx';

export default function ModuloVinculaciones({ filtroGlobal = '' }) {
	const [datos, setDatos] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [propiedades, setPropiedades] = useState([]);
	const [cargando, setCargando] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'nuevo', 'editar'
	const [aEliminar, setAEliminar] = useState(null);
	const [mostrarFiltros, setMostrarFiltros] = useState(false);
	const [filtroEstado, setFiltroEstado] = useState('Todos');

	const [form, setForm] = useState({
		id: null,
		idUsuario: '',
		idPropiedad: '',
		tipoVinculo: 'Residente',
	});

	const cargarTodo = async () => {
		setCargando(true);
		try {
			const [resVinc, resUsu, resProp] = await Promise.all([
				vinculacionesApi.obtenerTodas(),
				usuariosApi.obtenerTodos(),
				propiedadesApi.obtenerTodas(),
			]);

			const formateados = resVinc.data.map((v) => ({
				id: v.ID_USUARIO_PROPIEDAD,
				usuario: v.NOMBRE_USUARIO,
				idUsuario: v.ID_USUARIO,
				propiedad: v.NUMERO_PROPIEDAD,
				idPropiedad: v.ID_PROPIEDAD,
				tipoVinculo: v.TIPO_VINCULO,
				fechaInicio: new Date(v.FECHA_INICIO).toLocaleDateString(),
				estado: v.ACTIVO === 1 ? 'Activo' : 'Inactivo',
			}));

			setDatos(formateados);
			setUsuarios(resUsu.data || []);
			setPropiedades(resProp.data || []);
		} catch (error) {
			console.error('Error al cargar datos:', error);
			if (error.response?.status === 401) {
				toast.error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
			}
		} finally {
			setCargando(false);
		}
	};

	useEffect(() => {
		cargarTodo();
	}, []);

	const termino = (busqueda || filtroGlobal).toLowerCase().trim();
	const filtradosBusqueda = termino
		? datos.filter(
				(v) =>
					v.usuario.toLowerCase().includes(termino) || v.propiedad.toLowerCase().includes(termino),
			)
		: datos;
	const filtrados = filtradosBusqueda.filter(v => filtroEstado === 'Todos' || v.estado === filtroEstado);

	const residentesFiltrados = filtrados;

	const renderTabla = (lista, titulo) => (
		<div className="mb-6">
			<h3 className="text-sm font-bold text-primario px-4 mb-2 uppercase tracking-wider">{titulo} ({lista.length})</h3>
			<div className="overflow-x-auto">
				<table className="w-full">
					<CabeceraTabla
						columnas={['Propiedad', 'Usuario Residente', 'Inicio', 'Estado', 'Acciones']}
					/>
					<tbody>
						{lista.map((vinc, i) => (
							<Fila key={vinc.id} indice={i}>
								<Celda mono>{vinc.propiedad}</Celda>
								<Celda className="font-bold text-primario">{vinc.usuario}</Celda>
								<Celda className="text-xs text-zinc-500">{vinc.fechaInicio}</Celda>
								<td className="px-4 py-3">
									<Etiqueta
										texto={vinc.estado}
										variante={vinc.estado === 'Activo' ? 'activo' : 'inactivo'}
									/>
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion
											Icono={Pencil}
											onClick={() => abrirModalEditar(vinc)}
											colorHover="hover:text-blue-400"
											titulo="Editar"
										/>
										<BtnAccion
											Icono={Ban}
											onClick={() => toggleEstado(vinc.id, vinc.estado)}
											colorHover="hover:text-amber-400"
											titulo="Cambiar estado"
										/>
										<BtnAccion
											Icono={Trash2}
											onClick={() => setAEliminar(vinc)}
											colorHover="hover:text-red-500"
											titulo="Eliminar"
										/>
									</div>
								</td>
							</Fila>
						))}
						{lista.length === 0 && (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center text-secundario text-sm">
									No hay registros para mostrar.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);

	const abrirModalNuevo = () => {
		setForm({ id: null, idUsuario: '', idPropiedad: '', tipoVinculo: 'Residente' });
		setModal('nuevo');
	};

	const abrirModalEditar = (vinculo) => {
		setForm({
			id: vinculo.id,
			idUsuario: vinculo.idUsuario,
			idPropiedad: vinculo.idPropiedad,
			tipoVinculo: vinculo.tipoVinculo,
		});
		setModal('editar');
	};

	const guardarVinculo = async (e) => {
		e.preventDefault();
		const payload = {
			idUsuario: Number(form.idUsuario),
			idPropiedad: Number(form.idPropiedad),
			tipoVinculo: form.tipoVinculo,
		};

		try {
			if (form.id) {
				await vinculacionesApi.actualizar(form.id, payload);
				toast.success('Vínculo actualizado exitosamente');
			} else {
				await vinculacionesApi.crear(payload);
				toast.success('Vínculo creado exitosamente');
			}
			await cargarTodo();
			setModal(null);
		} catch (error) {
			const msj = extraerError(error) || 'Error al guardar el vínculo.';
			toast.error(msj);
		}
	};

	const toggleEstado = async (id, estadoActual) => {
		try {
			const nuevoActivo = estadoActual === 'Activo' ? 0 : 1;
			await vinculacionesApi.actualizar(id, { activo: nuevoActivo });
			await cargarTodo();
			toast.success('Estado de vínculo actualizado');
		} catch (error) {
			const msj = extraerError(error) || 'Error al cambiar el estado.';
			toast.error(msj);
		}
	};

	const confirmarEliminar = async () => {
		try {
			await vinculacionesApi.eliminar(aEliminar.id);
			await cargarTodo();
			setAEliminar(null);
			toast.success('Vínculo eliminado exitosamente');
		} catch (error) {
			const msj = extraerError(error) || 'Error al eliminar.';
			toast.error(msj);
		}
	};

	if (cargando) return <Cargando Texto={'Vinculaciones'} />;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-3 gap-4">
				<TarjetaMetrica
					etiqueta="Total de Vínculos"
					valor={datos.length}
					Icono={Link}
					fondo="bg-zinc-800"
				/>
			</div>

			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex flex-col gap-4 p-4 border-b border-borde bg-tarjeta/50">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
							<button 
								onClick={() => setMostrarFiltros(!mostrarFiltros)}
								className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium ${mostrarFiltros ? 'bg-primario/10 border-primario/30 text-primario' : 'bg-fondo border-borde text-secundario hover:text-primario hover:bg-zinc-800'}`}
							>
								<Filter className="w-4 h-4" />
								<span className="hidden sm:inline">Filtros</span>
							</button>
						</div>
						<BtnPrimario onClick={abrirModalNuevo}>
							<Plus className="w-4 h-4" /> Asignar Usuario
						</BtnPrimario>
					</div>

					{mostrarFiltros && (
						<div className="flex gap-4 p-3 rounded-lg bg-zinc-900/50 border border-borde/50 animate-in slide-in-from-top-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-xs font-medium text-secundario">Estado</label>
								<select 
									value={filtroEstado}
									onChange={(e) => setFiltroEstado(e.target.value)}
									className="bg-fondo border border-borde text-primario text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primario/50"
								>
									<option value="Todos">Todos</option>
									<option value="Activo">Activos</option>
									<option value="Inactivo">Inactivos</option>
								</select>
							</div>
						</div>
					)}
				</div>
				<div className="py-2">
					{renderTabla(residentesFiltrados, 'Residentes Asignados')}
				</div>
				<PieTabla mostrados={filtrados.length} total={datos.length} unidad="vínculos" />
			</div>

			{modal && (
				<Modal
					titulo={modal === 'nuevo' ? 'Asignar Usuario a Propiedad' : 'Editar Vínculo'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardarVinculo} className="space-y-4">
						<Campo etiqueta="Usuario / Residente">
							<Selector
								required
								value={form.idUsuario}
								onChange={(e) => setForm({ ...form, idUsuario: e.target.value })}
							>
								<option value="">Seleccione una persona...</option>
								{usuarios.map((u) => (
									<option key={u.ID_USUARIO} value={u.ID_USUARIO}>
										{u.NOMBRE} {u.APELLIDO}
									</option>
								))}
							</Selector>
						</Campo>

							<Campo etiqueta="Propiedad (Casa/Apto)">
								<Selector
									required
									value={form.idPropiedad}
									onChange={(e) => setForm({ ...form, idPropiedad: e.target.value })}
									disabled={modal === 'editar'}
								>
									<option value="">Seleccione propiedad...</option>
									{propiedades.map((p) => (
										<option key={p.ID_PROPIEDAD} value={p.ID_PROPIEDAD}>
											{p.NUMERO_PROPIEDAD} - {p.CATEGORIA_NOMBRE}
										</option>
									))}
								</Selector>
							</Campo>

						{modal === 'nuevo' && (
							<p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-2">
								Nota: No puede haber dos propietarios activos en la misma casa.
							</p>
						)}

						<BotonesModal alCancelar={() => setModal(null)} textoGuardar="Guardar Vínculo" />
					</form>
				</Modal>
			)}

			{aEliminar && (
				<ModalConfirmacion
					titulo="¿Desvincular Usuario?"
					mensaje={`Se eliminará permanentemente la conexión entre ${aEliminar.usuario} y la propiedad ${aEliminar.propiedad}.`}
					onCancelar={() => setAEliminar(null)}
					onConfirmar={confirmarEliminar}
				/>
			)}
		</div>
	);
}
