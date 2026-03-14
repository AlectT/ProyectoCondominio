export function ModuloPendiente({ nombre, Icono }) {
	return (
		<div className="flex flex-col items-center justify-center h-72 rounded-2xl border bg-zinc-900/40 border-borde gap-4 animate-in fade-in duration-300">
			<div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-borde bg-fondo shadow-sm">
				<Icono className="w-6 h-6 text-zinc-600" />
			</div>
			<div className="text-center space-y-1">
				<p className="text-sm font-semibold font-title text-zinc-400">{nombre}</p>
				<p className="text-xs text-zinc-600">Módulo en desarrollo por otro equipo.</p>
			</div>
		</div>
	);
}
