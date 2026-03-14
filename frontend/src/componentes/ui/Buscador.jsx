import { Search, X } from 'lucide-react'

export function BuscadorCasa({ valor, alCambiar }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-tarjeta border-borde w-64 focus-within:border-zinc-500 transition-colors shadow-sm">
      <Search className="w-3.5 h-3.5 text-secundario flex-shrink-0" />
      <input
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        placeholder="Filtrar..."
        className="w-full text-sm bg-transparent border-none outline-none text-primario placeholder:text-zinc-600"
      />
      {valor && (
        <button onClick={() => alCambiar('')} className="text-zinc-600 hover:text-zinc-400 transition-colors">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
