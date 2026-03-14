import { X, AlertTriangle } from 'lucide-react'

export function Modal({ titulo, alCerrar, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 border shadow-2xl bg-tarjeta border-borde rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-borde bg-fondo">
          <h2 className="text-sm font-semibold font-title text-primario">{titulo}</h2>
          <button onClick={alCerrar} className="p-1 rounded-lg transition-colors hover:bg-zinc-800">
            <X className="w-4 h-4 text-secundario" />
          </button>
        </div>
        <div className="p-6 bg-tarjeta">{children}</div>
      </div>
    </div>
  )
}

export function ModalConfirmacion({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm mx-4 bg-tarjeta border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(239,68,68,0.25)] animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-primario mb-2">{titulo}</h2>
          <p className="text-sm text-zinc-400 mb-8">{mensaje}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancelar}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-borde text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
            >
              Sí, confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
