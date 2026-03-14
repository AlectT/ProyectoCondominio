export function CabeceraTabla({ columnas }) {
  return (
    <thead>
      <tr className="border-b border-borde bg-fondo/50">
        {columnas.map((col) => (
          <th
            key={col}
            className="px-4 py-3 text-left text-[11px] font-bold text-secundario tracking-wide uppercase"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export function Fila({ seleccionada, onClick, children }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-borde/50 cursor-pointer transition-colors select-none fila-tabla ${
        seleccionada ? 'fila-seleccionada border-l-2 border-l-primario' : 'fila-normal'
      }`}
    >
      {children}
    </tr>
  )
}

export function Celda({ children, mono }) {
  return (
    <td className={`px-4 py-3 text-sm font-bold text-primario ${mono ? 'font-mono' : ''}`}>
      {children}
    </td>
  )
}

export function PieTabla({ mostrados, total, unidad }) {
  return (
    <div className="px-4 py-3 text-[11px] text-secundario border-t border-borde bg-fondo/50">
      Mostrando {mostrados} de {total} {unidad}
    </div>
  )
}
