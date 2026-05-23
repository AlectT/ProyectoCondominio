export function Campo({ etiqueta, error, ayuda, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[11px] font-medium text-secundario uppercase tracking-wide">
        {etiqueta}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 mt-1 animate-in slide-in-from-top-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
          {error}
        </p>
      )}
      {ayuda && !error && (
        <p className="text-[11px] text-zinc-500 mt-1">{ayuda}</p>
      )}
    </div>
  )
}

export function Entrada({ hasError, ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border rounded-lg bg-fondo text-primario placeholder:text-zinc-600 focus:outline-none transition-colors ${
        hasError 
          ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
          : 'border-borde focus:border-zinc-500'
      }`}
      {...props}
    />
  )
}

export function Selector({ hasError, children, ...props }) {
  return (
    <select
      className={`w-full px-3 py-2 text-sm border rounded-lg bg-fondo text-primario focus:outline-none transition-colors ${
        hasError 
          ? 'border-red-500/50 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
          : 'border-borde focus:border-zinc-500'
      }`}
      {...props}
    >
      {children}
    </select>
  )
}
