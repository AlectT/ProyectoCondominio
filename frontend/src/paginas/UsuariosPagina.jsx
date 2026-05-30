// ============================================================
// 📁 RUTA: frontend/src/paginas/UsuariosPagina.jsx
// ============================================================
import { useState } from 'react';
import { Plus, Eye, Pencil, Ban, Users, ShieldCheck, UserCheck, UserX, Filter } from 'lucide-react';
import { useUsuarios } from '../hooks/useUsuarios.js';
import { TarjetaMetrica } from '../componentes/ui/Etiquetas.jsx';
import { Etiqueta } from '../componentes/ui/Etiquetas.jsx';
import { BuscadorCasa } from '../componentes/ui/Buscador.jsx';
import { BtnPrimario, BtnAccion, BotonesModal } from '../componentes/ui/Botones.jsx';
import { CabeceraTabla, Fila, Celda, PieTabla } from '../componentes/ui/Tablas.jsx';
import { Modal, ModalConfirmacion } from '../componentes/ui/Modales.jsx';
import { Campo, Entrada, Selector } from '../componentes/ui/Formularios.jsx';
import { extraerError } from '../utilidades/extraerError.js';
import { toast } from 'sonner';
import {
	validarNombrePersona,
	validarNombreUsuario,
	validarTelefono,
	limpiarNombre,
	limpiarAlfanumerico
} from '../utilidades/validarTexto.js';
import Cargando from '../componentes/ui/Cargando.jsx';

const ROLES = ['Administrador', 'Residente', 'Guardia', 'Colaborador'];

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function UsuariosPagina({ filtroGlobal = '' }) {
	const { usuarios, cargando, error, crear, actualizar, desactivar, activar } = useUsuarios();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'crear' | 'editar' | 'ver'
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aDesactivar, setADesactivar] = useState(null);
	const [aActivar, setAActivar] = useState(null);
	const [errorModal, setErrorModal] = useState('');
	const [mostrarFiltros, setMostrarFiltros] = useState(false);
	const [filtroRol, setFiltroRol] = useState('Todos');
	const [filtroEstado, setFiltroEstado] = useState('Todos');
	const [errores, setErrores] = useState({});
	const [vistaActiva, setVistaActiva] = useState('sistema'); // 'sistema' | 'residentes'

	const [form, setForm] = useState({
		nombreUsuario: '',
		nombre: '',
		apellido: '',
		correo: '',
		contrasena: '',
		telefono: '',
		idRol: 2,
	});

	const termino = limpiar(busqueda || filtroGlobal);
	const filtrados = usuarios.filter((u) => {
		const cumpleTexto = !termino ||
			limpiar(u.NOMBRE_USUARIO).includes(termino) ||
			limpiar(u.NOMBRE).includes(termino) ||
			limpiar(u.APELLIDO).includes(termino) ||
			limpiar(u.CORREO).includes(termino) ||
			limpiar(u.ROL).includes(termino);
			
		const cumpleRol = filtroRol === 'Todos' || u.ROL === filtroRol;
		const estadoActual = u.ACTIVO ? 'Activo' : 'Inactivo';
		const cumpleEst = filtroEstado === 'Todos' || estadoActual === filtroEstado;

		return cumpleTexto && cumpleRol && cumpleEst;
	});

	const personalSistema = filtrados.filter((u) => ['Administrador', 'Guardia', 'Colaborador'].includes(u.ROL));
	const residentes = filtrados.filter((u) => u.ROL === 'Residente');

	const renderTabla = (lista, titulo) => (
		<div className="mb-6">
			<h3 className="text-sm font-bold text-primario px-4 mb-2 uppercase tracking-wider">{titulo} ({lista.length})</h3>
			<div className="overflow-x-auto">
				<table className="w-full">
					<CabeceraTabla columnas={['Usuario', 'Nombre', 'Correo', 'Rol', 'Estado', 'Acciones']} />
					<tbody>
						{lista.map((u) => (
							<Fila
								key={u.ID_USUARIO}
								seleccionada={filaActiva === u.ID_USUARIO}
								onClick={() => setFilaActiva(filaActiva === u.ID_USUARIO ? null : u.ID_USUARIO)}
							>
								<Celda mono>{u.NOMBRE_USUARIO}</Celda>
								<Celda>
									{u.NOMBRE} {u.APELLIDO}
								</Celda>
								<Celda>{u.CORREO}</Celda>
								<Celda>
									<Etiqueta texto={u.ROL} />
								</Celda>
								<Celda>
									<Etiqueta
										texto={u.ACTIVO ? 'Activo' : 'Inactivo'}
										variante={varianteActivo(u.ACTIVO)}
									/>
								</Celda>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1">
										<BtnAccion onClick={() => abrirVer(u)} Icono={Eye} titulo="Ver" />
										<BtnAccion onClick={() => abrirEditar(u)} Icono={Pencil} titulo="Editar" />
										{u.ACTIVO === 1 ? (
											<BtnAccion
												onClick={() => setADesactivar(u)}
												Icono={Ban}
												titulo="Desactivar"
												colorHover="hover:text-red-400"
											/>
										) : (
											<BtnAccion
												onClick={() => setAActivar(u)}
												Icono={UserCheck}
												titulo="Activar"
												colorHover="hover:text-emerald-400"
											/>
										)}
									</div>
								</td>
							</Fila>
						))}
						{lista.length === 0 && (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center text-secundario text-sm">
									No hay usuarios en esta categoría
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);

	const abrirCrear = () => {
		setForm({
			nombreUsuario: '',
			nombre: '',
			apellido: '',
			correo: '',
			contrasena: '',
			telefono: '',
			idRol: 2,
		});
		setErrorModal('');
		setErrores({});
		setModal('crear');
	};

	const abrirEditar = (u) => {
		setSeleccion(u);
		setForm({
			nombreUsuario: u.NOMBRE_USUARIO,
			nombre: u.NOMBRE,
			apellido: u.APELLIDO,
			correo: u.CORREO,
			contrasena: '',
			telefono: u.TELEFONO ?? '',
			idRol: u.ID_ROL,
		});
		setErrorModal('');
		setErrores({});
		setModal('editar');
	};

	const abrirVer = (u) => {
		setSeleccion(u);
		setModal('ver');
	};

	const manejarCambio = (campo, valor) => {
		let nuevoValor = valor;
		let error = null;

		if (campo === 'nombreUsuario') {
			nuevoValor = limpiarAlfanumerico(valor);
			if (valor !== nuevoValor) toast.error('Carácter inválido eliminado', { id: 'char-err' });

			if (nuevoValor.length > 0 && !validarNombreUsuario(nuevoValor)) {
				error = 'Usuario inválido. Min 3 caracteres alfanuméricos.';
			} else if (nuevoValor.length === 0) {
				error = 'El usuario es obligatorio.';
			}
		} else if (campo === 'nombre') {
			nuevoValor = limpiarNombre(valor);
			if (valor !== nuevoValor) toast.error('Carácter inválido eliminado', { id: 'char-err' });

			if (nuevoValor.length > 0 && !validarNombrePersona(nuevoValor)) {
				error = 'Ingrese un nombre válido, solo letras.';
			} else if (nuevoValor.length === 0) {
				error = 'El nombre es obligatorio.';
			}
		} else if (campo === 'apellido') {
			nuevoValor = limpiarNombre(valor);
			if (valor !== nuevoValor) toast.error('Carácter inválido eliminado', { id: 'char-err' });

			if (nuevoValor.length > 0 && !validarNombrePersona(nuevoValor)) {
				error = 'Ingrese un apellido válido, solo letras.';
			} else if (nuevoValor.length === 0) {
				error = 'El apellido es obligatorio.';
			}
		} else if (campo === 'telefono') {
			if (valor && !validarTelefono(valor)) {
				error = 'Teléfono inválido.';
			}
		}

		setForm((prev) => ({ ...prev, [campo]: nuevoValor }));
		setErrores((prev) => ({ ...prev, [campo]: error }));
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');

		if (!validarNombreUsuario(form.nombreUsuario)) {
			const msj = 'El nombre de usuario no es válido (mínimo 3 caracteres, sin espacios ni caracteres especiales).';
			setErrores(prev => ({...prev, nombreUsuario: msj}));
			setErrorModal(msj);
			toast.error(msj);
			return;
		}
		if (!validarNombrePersona(form.nombre)) {
			setErrores(prev => ({...prev, nombre: 'El nombre ingresado no parece válido.'}));
			toast.error('Corrige los errores en el formulario.');
			return;
		}
		if (!validarNombrePersona(form.apellido)) {
			setErrores(prev => ({...prev, apellido: 'El apellido ingresado no parece válido.'}));
			toast.error('Corrige los errores en el formulario.');
			return;
		}
		if (!form.telefono || !validarTelefono(form.telefono)) {
			setErrores(prev => ({...prev, telefono: 'El número de teléfono es obligatorio y debe ser válido.'}));
			toast.error('Corrige los errores en el formulario.');
			return;
		}

		try {
			if (modal === 'crear') {
				const datos = { ...form, idRol: Number(form.idRol) };
				await crear(datos);
				toast.success('Usuario creado exitosamente');
			} else {
				const datos = { ...form, idRol: Number(form.idRol) };
				if (!datos.contrasena) delete datos.contrasena;
				await actualizar(seleccion.ID_USUARIO, datos);
				toast.success('Usuario actualizado exitosamente');
			}
			setModal(null);
		} catch (err) {
			const msj = extraerError(err) || 'Error al guardar el usuario';
			setErrorModal(msj);
			toast.error(msj);
		}
	};

	const confirmarDesactivar = async () => {
		try {
			await desactivar(aDesactivar.ID_USUARIO);
			toast.success('Usuario desactivado exitosamente');
		} catch (err) {
			const msj = extraerError(err) || 'Error al desactivar el usuario';
			console.error('Error al desactivar:', msj);
			toast.error(msj);
		}
		setADesactivar(null);
	};

	const confirmarActivar = async () => {
		try {
			await activar(aActivar.ID_USUARIO);
			toast.success('Usuario activado exitosamente');
		} catch (err) {
			const msj = extraerError(err) || 'Error al activar el usuario';
			console.error('Error al activar:', msj);
			toast.error(msj);
		}
		setAActivar(null);
	};

	const varianteActivo = (activo) => (activo ? 'activo' : 'inactivo');

	if (cargando) return <Cargando Texto={'Usuarios'} />;
	if (error) return <div className="text-red-400 text-sm p-8">{error}</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-300">
			<div className="grid grid-cols-4 gap-4">
				<TarjetaMetrica
					etiqueta="Total Usuarios"
					valor={usuarios.length}
					Icono={Users}
					fondo="bg-zinc-800"
				/>
				<TarjetaMetrica
					etiqueta="Activos"
					valor={usuarios.filter((u) => u.ACTIVO).length}
					Icono={UserCheck}
					fondo="bg-emerald-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Inactivos"
					valor={usuarios.filter((u) => !u.ACTIVO).length}
					Icono={UserX}
					fondo="bg-red-500/10"
				/>
				<TarjetaMetrica
					etiqueta="Administradores"
					valor={usuarios.filter((u) => u.ROL === 'Administrador').length}
					Icono={ShieldCheck}
					fondo="bg-sky-500/10"
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
						<BtnPrimario onClick={abrirCrear}>
							<Plus className="w-4 h-4" /> Nuevo Usuario
						</BtnPrimario>
					</div>

					{mostrarFiltros && (
						<div className="flex gap-4 p-3 rounded-lg bg-zinc-900/50 border border-borde/50 animate-in slide-in-from-top-2">
							<div className="flex flex-col gap-1.5">
								<label className="text-xs font-medium text-secundario">Rol</label>
								<select 
									value={filtroRol}
									onChange={(e) => setFiltroRol(e.target.value)}
									className="bg-fondo border border-borde text-primario text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primario/50"
								>
									<option value="Todos">Todos</option>
									{ROLES.map(r => <option key={r} value={r}>{r}</option>)}
								</select>
							</div>
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

				<div className="flex gap-2 px-4 border-b border-borde bg-tarjeta/50 pb-4">
					<button 
						onClick={() => setVistaActiva('sistema')}
						className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${vistaActiva === 'sistema' ? 'bg-primario text-fondo' : 'bg-fondo border border-borde text-secundario hover:text-primario hover:bg-zinc-800'}`}
					>
						Usuarios de Sistema
					</button>
					<button 
						onClick={() => setVistaActiva('residentes')}
						className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${vistaActiva === 'residentes' ? 'bg-primario text-fondo' : 'bg-fondo border border-borde text-secundario hover:text-primario hover:bg-zinc-800'}`}
					>
						Residentes
					</button>
				</div>

				<div className="py-2 mt-4">
					{vistaActiva === 'sistema' && renderTabla(personalSistema, 'Personal del Sistema')}
					{vistaActiva === 'residentes' && renderTabla(residentes, 'Residentes del Condominio')}
				</div>
				<PieTabla mostrados={vistaActiva === 'sistema' ? personalSistema.length : residentes.length} total={usuarios.length} unidad="usuarios" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Usuario' : 'Editar Usuario'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre de usuario" error={errores.nombreUsuario}>
								<Entrada
									required
									value={form.nombreUsuario}
									onChange={(e) => manejarCambio('nombreUsuario', e.target.value)}
									placeholder="ej: jperez"
									hasError={!!errores.nombreUsuario}
								/>
							</Campo>
							<Campo etiqueta="Rol">
								<Selector
									value={form.idRol}
									onChange={(e) => setForm({ ...form, idRol: e.target.value })}
								>
									<option value={2}>Administrador</option>
									<option value={1}>Residente</option>
									<option value={3}>Guardia</option>
									<option value={4}>Colaborador</option>
								</Selector>
							</Campo>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre" error={errores.nombre}>
								<Entrada
									required
									value={form.nombre}
									onChange={(e) => manejarCambio('nombre', e.target.value)}
									placeholder="Juan"
									hasError={!!errores.nombre}
								/>
							</Campo>
							<Campo etiqueta="Apellido" error={errores.apellido}>
								<Entrada
									required
									value={form.apellido}
									onChange={(e) => manejarCambio('apellido', e.target.value)}
									placeholder="Pérez"
									hasError={!!errores.apellido}
								/>
							</Campo>
						</div>
						<Campo etiqueta="Correo">
							<Entrada
								required
								type="email"
								value={form.correo}
								onChange={(e) => setForm({ ...form, correo: e.target.value })}
								placeholder="juan@ejemplo.com"
							/>
						</Campo>
						<Campo
							etiqueta={
								modal === 'editar' ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'
							}
						>
							<Entrada
								required={modal === 'crear'}
								type="password"
								value={form.contrasena}
								onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
								placeholder="••••••••"
							/>
						</Campo>
						<Campo etiqueta="Teléfono" error={errores.telefono}>
							<Entrada
								required
								value={form.telefono}
								onChange={(e) => manejarCambio('telefono', e.target.value)}
								placeholder="502 1234 5678"
								hasError={!!errores.telefono}
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
				<Modal titulo="Detalle de Usuario" alCerrar={() => setModal(null)}>
					<div className="space-y-3 text-sm">
						{[
							['Usuario', seleccion.NOMBRE_USUARIO],
							['Nombre', `${seleccion.NOMBRE} ${seleccion.APELLIDO}`],
							['Correo', seleccion.CORREO],
							['Teléfono', seleccion.TELEFONO ?? '—'],
							['Rol', seleccion.ROL],
							['Estado', seleccion.ACTIVO ? 'Activo' : 'Inactivo'],
						].map(([lbl, val]) => (
							<div key={lbl} className="flex justify-between border-b border-borde pb-2">
								<span className="text-secundario">{lbl}</span>
								<span className="text-primario font-medium">{val}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{aDesactivar && (
				<ModalConfirmacion
					titulo="¿Desactivar usuario?"
					mensaje={`El usuario "${aDesactivar.NOMBRE_USUARIO}" no podrá iniciar sesión.`}
					onConfirmar={confirmarDesactivar}
					onCancelar={() => setADesactivar(null)}
				/>
			)}

			{aActivar && (
				<ModalConfirmacion
					titulo="¿Activar usuario?"
					mensaje={`El usuario "${aActivar.NOMBRE_USUARIO}" podrá iniciar sesión nuevamente.`}
					onConfirmar={confirmarActivar}
					onCancelar={() => setAActivar(null)}
				/>
			)}
		</div>
	);
}
