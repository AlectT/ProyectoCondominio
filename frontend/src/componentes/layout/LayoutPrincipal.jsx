// ============================================================
// 📁 RUTA: frontend/src/componentes/layout/LayoutPrincipal.jsx
// ============================================================

import { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { ModuloPendiente } from '../ModuloPendiente.jsx';
import { GRUPOS } from '../../datos/datosDePrueba.js';

import UsuariosPagina from '../../paginas/UsuariosPagina.jsx';
import TicketsPagina from '../../paginas/TicketsPagina.jsx';
import ModuloPropiedades from '../../paginas/modulos/ModuloPropiedades.jsx';
import ModuloCategorias from '../../paginas/modulos/ModuloCategorias.jsx';
import ModuloVinculaciones from '../../paginas/modulos/ModuloVinculaciones.jsx';
import ModuloInvitaciones from '../../paginas/modulos/ModuloInvitaciones.jsx';
import ModuloVehiculos from '../../paginas/modulos/ModuloVehiculos.jsx';
import ModuloMulta from '../../paginas/modulos/ModuloMulta.jsx';
import PantallaBienvenida from '../../paginas/modulos/PantallaBienvenida.jsx';

const SUBTITULOS = {
	'Gestión de Propiedades': 'Administración general de unidades y responsables',
	'Categorías de Propiedad': 'Catálogo de tipos de propiedad, cuotas y parqueos',
	'Vinculación Usuario-Propiedad': 'Control de propietarios e inquilinos por unidad',
	'Directorio Residentes': 'Gestión de usuarios del sistema',
	'Control Vehicular': 'Padrón oficial de vehículos asociados a casas',
	'Pases de Visita (QR)': 'Generación de códigos de acceso temporales',
	'Infracciones y Multas': 'Bitácora de faltas y control de sanciones',
	'Mesa de Ayuda': 'Gestión de tickets asignados al personal',
};

export default function LayoutPrincipal() {
	const [moduloActivo, setModuloActivo] = useState(null);
	const [busquedaGlobal, setBusquedaGlobal] = useState('');

	const VISTAS = {
		'Gestión de Propiedades': <ModuloPropiedades filtroGlobal={busquedaGlobal} />,
		'Categorías de Propiedad': <ModuloCategorias filtroGlobal={busquedaGlobal} />,
		'Vinculación Usuario-Propiedad': <ModuloVinculaciones filtroGlobal={busquedaGlobal} />,
		'Control Vehicular': <ModuloVehiculos filtroGlobal={busquedaGlobal} />,
		'Pases de Visita (QR)': <ModuloInvitaciones filtroGlobal={busquedaGlobal} />,
		'Infracciones y Multas': <ModuloMulta filtroGlobal={busquedaGlobal} />,
		'Directorio Residentes': <UsuariosPagina filtroGlobal={busquedaGlobal} />,
		'Mesa de Ayuda': <TicketsPagina filtroGlobal={busquedaGlobal} />,
	};

	const infoModulo = GRUPOS.flatMap((g) => g.modulos).find((m) => m.id === moduloActivo);

	const vistaActual =
		VISTAS[moduloActivo] ??
		(moduloActivo ? (
			<ModuloPendiente nombre={infoModulo?.id || moduloActivo} Icono={infoModulo?.Icono} />
		) : (
			<PantallaBienvenida setModuloActivo={setModuloActivo} />
		));

	return (
		<div className="flex h-screen overflow-hidden bg-fondo text-primario transition-colors duration-300">
			<Sidebar moduloActivo={moduloActivo} setModuloActivo={setModuloActivo} />
			<div className="flex flex-col flex-1 min-w-0 relative z-10">
				<Topbar
					moduloActivo={moduloActivo}
					setModuloActivo={setModuloActivo}
					busquedaGlobal={busquedaGlobal}
					setBusquedaGlobal={setBusquedaGlobal}
					subtitulo={
						!moduloActivo
							? 'Panel de gestión residencial'
							: (SUBTITULOS[moduloActivo] ?? 'Módulo en desarrollo')
					}
				/>
				<main className="flex-1 p-8 overflow-y-auto bg-fondo custom-scrollbar transition-colors duration-300">
					<div className="max-w-7xl mx-auto">{vistaActual}</div>
				</main>
			</div>
		</div>
	);
}
