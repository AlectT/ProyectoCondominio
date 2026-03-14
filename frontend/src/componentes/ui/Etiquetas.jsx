export function Etiqueta({ texto, variante = 'default' }) {
  const estilos = {
    activo:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    pendiente: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    inactivo:  'bg-zinc-500/10 text-zinc-400 border border-zinc-600/30',
    utilizado: 'bg-zinc-500/10 text-zinc-400 border border-zinc-600/30',
    pagado:    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    expirado:  'bg-red-500/10 text-red-400 border border-red-500/20',
    normal:    'bg-violet-500/10 text-violet-400 border border-violet-500/20',
    servicio:  'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20',
    abierto:   'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    en_progreso: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    resuelto:  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    cerrado:   'bg-zinc-500/10 text-zinc-400 border border-zinc-600/30',
    cancelado: 'bg-red-500/10 text-red-400 border border-red-500/20',
    default:   'bg-zinc-800 text-zinc-300 border border-zinc-700',
  }

  const clave = texto?.toLowerCase().replace(' ', '_')

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${estilos[clave] ?? estilos.default}`}
    >
      {texto}
    </span>
  )
}

export function TarjetaMetrica({ etiqueta, valor, Icono, fondo, textoIcono }) {
  return (
    <div className="p-5 border bg-fondo border-borde rounded-xl shadow-sm hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-secundario">{etiqueta}</span>
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${fondo ?? 'bg-zinc-800'}`}>
          {textoIcono ? (
            <span className="text-sm font-bold text-primario">{textoIcono}</span>
          ) : (
            <Icono className="w-4 h-4 text-primario" />
          )}
        </div>
      </div>
      <p className="text-2xl font-bold font-title text-primario">{valor}</p>
    </div>
  )
}
