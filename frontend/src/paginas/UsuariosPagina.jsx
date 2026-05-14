// ============================================================
// 📁 RUTA: frontend/src/paginas/UsuariosPagina.jsx
// ============================================================
import { useState } from 'react';
import { Plus, Eye, Pencil, Ban, Users, ShieldCheck, UserCheck, UserX } from 'lucide-react';
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

const ROLES = ['Administrador', 'Residente', 'Guardia', 'Colaborador'];

const limpiar = (str) => str?.toString().toLowerCase().replace(/\s/g, '') ?? '';

export default function UsuariosPagina({ filtroGlobal = '' }) {
	const { usuarios, cargando, error, crear, actualizar, desactivar } = useUsuarios();

	const [busqueda, setBusqueda] = useState('');
	const [modal, setModal] = useState(null); // 'crear' | 'editar' | 'ver'
	const [filaActiva, setFilaActiva] = useState(null);
	const [seleccion, setSeleccion] = useState(null);
	const [aDesactivar, setADesactivar] = useState(null);
	const [errorModal, setErrorModal] = useState('');

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
	const filtrados = termino
		? usuarios.filter(
				(u) =>
					limpiar(u.NOMBRE_USUARIO).includes(termino) ||
					limpiar(u.NOMBRE).includes(termino) ||
					limpiar(u.APELLIDO).includes(termino) ||
					limpiar(u.CORREO).includes(termino) ||
					limpiar(u.ROL).includes(termino),
			)
		: usuarios;

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
		setModal('editar');
	};

	const abrirVer = (u) => {
		setSeleccion(u);
		setModal('ver');
	};

	const guardar = async (e) => {
		e.preventDefault();
		setErrorModal('');
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

	const varianteActivo = (activo) => (activo ? 'activo' : 'inactivo');

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
								Cargando usuarios
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
				<div className="flex items-center justify-between p-4 border-b border-borde bg-tarjeta/50">
					<BuscadorCasa valor={busqueda} alCambiar={setBusqueda} />
					<BtnPrimario onClick={abrirCrear}>
						<Plus className="w-4 h-4" /> Nuevo Usuario
					</BtnPrimario>
				</div>
				<table className="w-full">
					<CabeceraTabla columnas={['Usuario', 'Nombre', 'Correo', 'Rol', 'Estado', 'Acciones']} />
					<tbody>
						{filtrados.map((u) => (
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
										{u.ACTIVO === 1 && (
											<BtnAccion
												onClick={() => setADesactivar(u)}
												Icono={Ban}
												titulo="Desactivar"
												colorHover="hover:text-red-400"
											/>
										)}
									</div>
								</td>
							</Fila>
						))}
					</tbody>
				</table>
				<PieTabla mostrados={filtrados.length} total={usuarios.length} unidad="usuarios" />
			</div>

			{(modal === 'crear' || modal === 'editar') && (
				<Modal
					titulo={modal === 'crear' ? 'Nuevo Usuario' : 'Editar Usuario'}
					alCerrar={() => setModal(null)}
				>
					<form onSubmit={guardar} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre de usuario">
								<Entrada
									required
									value={form.nombreUsuario}
									onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })}
									placeholder="ej: jperez"
								/>
							</Campo>
							<Campo etiqueta="Rol">
								<Selector
									value={form.idRol}
									onChange={(e) => setForm({ ...form, idRol: e.target.value })}
								>
									<option value={1}>Administrador</option>
									<option value={2}>Residente</option>
									<option value={3}>Guardia</option>
									<option value={4}>Colaborador</option>
								</Selector>
							</Campo>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<Campo etiqueta="Nombre">
								<Entrada
									required
									value={form.nombre}
									onChange={(e) => setForm({ ...form, nombre: e.target.value })}
									placeholder="Juan"
								/>
							</Campo>
							<Campo etiqueta="Apellido">
								<Entrada
									required
									value={form.apellido}
									onChange={(e) => setForm({ ...form, apellido: e.target.value })}
									placeholder="Pérez"
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
						<Campo etiqueta="Teléfono (opcional)">
							<Entrada
								value={form.telefono}
								onChange={(e) => setForm({ ...form, telefono: e.target.value })}
								placeholder="502 1234 5678"
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
		</div>
	);
}
