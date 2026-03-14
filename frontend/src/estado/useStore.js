import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
	persist(
		(set) => ({
			usuario: null,
			setUsuario: (usuario) => set({ usuario }),
			limpiarUsuario: () => set({ usuario: null }),

			temaOscuro: true,
			toggleTema: () => set((s) => ({ temaOscuro: !s.temaOscuro })),
		}),
		{
			name: 'sesion-condominio', // clave en localStorage
			partialize: (s) => ({ usuario: s.usuario, temaOscuro: s.temaOscuro }),
		},
	),
);

export default useStore;
