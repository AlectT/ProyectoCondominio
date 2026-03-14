import { Save } from 'lucide-react'

export function BtnPrimario({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors shadow-sm"
    >
      {children}
    </button>
  )
}

export function BtnAccion({ onClick, Icono, titulo, colorHover = 'hover:text-primario' }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title={titulo}
      className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-secundario ${colorHover}`}
    >
      <Icono className="w-3.5 h-3.5" />
    </button>
  )
}

export function BotonesModal({ alCancelar, alGuardar, textoGuardar = 'Guardar', IconoGuardar = Save }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={alCancelar}
        className="flex-1 px-4 py-2 text-sm border rounded-lg border-borde text-secundario hover:text-primario transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        onClick={alGuardar}
        className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primario text-fondo hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
      >
        <IconoGuardar className="w-3.5 h-3.5" /> {textoGuardar}
      </button>
    </div>
  )
}
