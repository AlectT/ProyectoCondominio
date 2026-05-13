import {
	Building,
	Car,
	QrCode,
	Users,
	ParkingCircle,
	CalendarDays,
	PhoneCall,
	ArrowLeftRight,
	CreditCard,
	BookOpen,
	Layers,
	Ticket,
	Home,
	ShieldAlert,
	Wallet,
	Briefcase,
	ShieldCheck,
	Zap,
} from 'lucide-react';

// ─── MENÚ LATERAL + RBAC ──────────────────────────────────────────────────
export const GRUPOS = [
	{
		titulo: 'Residencial & Accesos',
		IconoGrupo: Home,
		modulos: [
			{ id: 'Gestión de Propiedades', Icono: Building, propio: true, roles: ['Administrador'] },
			{
				id: 'Directorio Residentes',
				Icono: Users,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Control Vehicular',
				Icono: Car,
				propio: true,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
			{
				id: 'Pases de Visita (QR)',
				Icono: QrCode,
				propio: true,
				roles: ['Administrador', 'Guardia', 'Residente'],
			},
			{
				id: 'Propietarios e Inquilinos',
				Icono: Users,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Inventario Parqueos',
				Icono: ParkingCircle,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
		],
	},
	{
		titulo: 'Seguridad & Garita',
		IconoGrupo: ShieldAlert,
		modulos: [
			{
				id: 'Punto de Ingreso',
				Icono: ShieldCheck,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Bitácora de Seguridad',
				Icono: BookOpen,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Asignación de Espacios',
				Icono: ArrowLeftRight,
				propio: true,
				roles: ['Administrador'],
			},
		],
	},
	{
		titulo: 'Finanzas & Disciplina',
		IconoGrupo: Wallet,
		modulos: [
			{
				id: 'Control de Cuotas',
				Icono: CreditCard,
				propio: true,
				roles: ['Administrador', 'Residente'],
			},
			{
				id: 'Historial Financiero',
				Icono: Zap,
				propio: false,
				roles: ['Administrador'],
			},
			{
				id: 'Llamados de Atención',
				Icono: PhoneCall,
				propio: true,
				roles: ['Administrador', 'Guardia'],
			},
			{
				id: 'Tipos de Cargo',
				Icono: Layers,
				propio: true,
				roles: ['Administrador'],
			},
			{
				id: 'Cargos Financieros',
				Icono: CreditCard,
				roles: ['Administrador'],
				propio: true,
			},
		],
	},
	{
		titulo: 'Operaciones & Soporte',
		IconoGrupo: Briefcase,
		modulos: [
			{
				id: 'Reservas de Áreas',
				Icono: CalendarDays,
				propio: true,
				roles: ['Administrador', 'Residente'],
			},
			{
				id: 'Mesa de Ayuda',
				Icono: Ticket,
				propio: true,
				roles: ['Administrador', 'Residente'],
			},
		],
	},
];

// ─── UTILIDADES ───────────────────────────────────────────────────────────
export const limpiarBusqueda = (str) =>
	str ? str.toString().replace(/[-\s]/g, '').toLowerCase() : '';