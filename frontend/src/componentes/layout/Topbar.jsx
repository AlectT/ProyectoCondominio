// ============================================================
// 📁 RUTA: frontend/src/componentes/layout/Topbar.jsx
// ============================================================

import { Search, Sun, Moon, X, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../estado/useStore.js';
import { usuariosApi } from '../../api/usuariosApi.js';

export function Topbar({
	moduloActivo,
	setModuloActivo,
	busquedaGlobal,
	setBusquedaGlobal,
	subtitulo,
}) {
	const { temaOscuro, toggleTema, limpiarUsuario } = useStore();
	const navigate = useNavigate();

	const cerrarSesion = async () => {
		try {
			await usuariosApi.logout();
		} catch (_error) {
			console.error('Error al cerrar sesión:', _error);
		} finally {
			limpiarUsuario();
			navigate('/login');
		}
	};

	return (
		<header className="flex items-center justify-between h-16 px-8 border-b border-borde bg-tarjeta/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-30 transition-colors duration-300">
			{/* Izquierda — casita + título */}
			<div className="flex items-center gap-3">
				{moduloActivo && (
					<button
						onClick={() => setModuloActivo(null)}
						title="Volver al inicio"
						className="flex items-center justify-center w-8 h-8 rounded-lg border border-borde bg-fondo hover:border-secundario transition-all duration-200 group flex-shrink-0"
					>
						<Home className="w-4 h-4 text-secundario group-hover:text-emerald-500 transition-colors duration-200" />
					</button>
				)}
				<div>
					<h1 className="text-[17px] font-bold font-title text-primario leading-tight">
						{moduloActivo ?? 'Panel Principal'}
					</h1>
					<p className="text-[11px] text-secundario leading-tight font-medium mt-0.5">
						{subtitulo}
					</p>
				</div>
			</div>

			{/* Derecha */}
			<div className="flex items-center gap-4">
				{/* Buscador */}
				<div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-fondo border-borde w-64 focus-within:border-secundario transition-all shadow-sm">
					<Search className="w-4 h-4 text-secundario flex-shrink-0" />
					<input
						type="text"
						value={busquedaGlobal}
						onChange={(e) => setBusquedaGlobal(e.target.value)}
						placeholder="Búsqueda General"
						className="w-full text-[13px] bg-transparent border-none outline-none text-primario placeholder:text-secundario"
					/>
					{busquedaGlobal && (
						<button
							onClick={() => setBusquedaGlobal('')}
							className="text-secundario hover:text-primario transition-colors bg-borde rounded-full p-0.5"
						>
							<X className="w-3 h-3" />
						</button>
					)}
				</div>

				{/* Toggle tema */}
				<button
					onClick={toggleTema}
					className="p-2 rounded-lg border border-borde hover:bg-fondo transition-colors"
					title={temaOscuro ? 'Modo claro' : 'Modo oscuro'}
				>
					{temaOscuro ? (
						<Sun className="w-5 h-5 text-amber-400" />
					) : (
						<Moon className="w-5 h-5 text-indigo-500" />
					)}
				</button>

				<div className="h-6 w-px bg-borde mx-1" />

				{/* Cerrar sesión */}
				<button
					onClick={cerrarSesion}
					className="px-4 py-2 text-[13px] font-bold rounded-lg bg-primario text-fondo hover:opacity-90 transition-all shadow-sm"
				>
					Cerrar sesión
				</button>
			</div>
		</header>
	);
}
