export function Campo({ etiqueta, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-secundario uppercase tracking-wide">
        {etiqueta}
      </label>
      {children}
    </div>
  )
}

export function Entrada(props) {
  return (
    <input
      className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
      {...props}
    />
  )
}

export function Selector({ children, ...props }) {
  return (
    <select
      className="w-full px-3 py-2 text-sm border rounded-lg bg-fondo border-borde text-primario focus:outline-none focus:border-zinc-500 transition-colors"
      {...props}
    >
      {children}
    </select>
  )
}
