import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
	persist(
		(set) => ({
			usuario: null,
			setUsuario: (usuario) => set({ usuario }),
			limpiarUsuario: () => set({ usuario: null }),

			temaOscuro: true,

			// 🔥 EL TRUCO ESTÁ AQUÍ 🔥
			toggleTema: () =>
				set((state) => {
					const nuevoTema = !state.temaOscuro;

					// Le inyectamos o quitamos la clase "dark" al HTML del navegador
					if (nuevoTema) {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}

					return { temaOscuro: nuevoTema };
				}),
		}),
		{
			name: 'sesion-condominio', // clave en localStorage
			partialize: (state) => ({ usuario: state.usuario, temaOscuro: state.temaOscuro }),

			// 🔥 Y AQUÍ PARA CUANDO CARGA LA PÁGINA POR PRIMERA VEZ 🔥
			onRehydrateStorage: () => (state) => {
				if (state) {
					if (state.temaOscuro) {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
				}
			},
		},
	),
);

export default useStore;
