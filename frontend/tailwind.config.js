// ============================================================
// 📁 RUTA: frontend/tailwind.config.js
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				title: ['Montserrat', 'sans-serif'],
			},
			// Colores apuntan a variables CSS → cambian automáticamente con el tema
			colors: {
				fondo: 'var(--color-fondo)',
				tarjeta: 'var(--color-tarjeta)',
				borde: 'var(--color-borde)',
				primario: 'var(--color-primario)',
				secundario: 'var(--color-secundario)',
				acento: 'var(--color-acento)',
			},
		},
	},
	plugins: [],
};
