// ============================================================
// 📁 RUTA: frontend/vite.config.js
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		// Permite conexiones desde otros dispositivos en la misma red WiFi
		// Sin esto el celular no puede acceder al frontend
		host: '0.0.0.0',
		port: 5173,
	},
});
