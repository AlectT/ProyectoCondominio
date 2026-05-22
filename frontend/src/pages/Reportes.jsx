import { useEffect, useState } from 'react';
import {
	FileText,
	Download,
	CreditCard,
	AlertTriangle,
	CalendarDays,
	Gavel,
	BarChart3,
	TrendingUp,
} from 'lucide-react';

import {
	obtenerPagos,
	obtenerMoras,
	obtenerReservas,
	obtenerMultas,
} from '../services/reportesService';

import GraficaPagos from '../components/reports/GraficaPagos';
import GraficaMoras from '../components/reports/GraficaMoras';
import GraficaReservas from '../components/reports/GraficaReservas';
import GraficaMultas from '../components/reports/GraficaMultas';

import { generarPDFPagos } from '../reports/pdf/pagosPDF';
import { generarPDFMoras } from '../reports/pdf/morasPDF';
import { generarPDFReservas } from '../reports/pdf/reservasPDF';
import { generarPDFMultas } from '../reports/pdf/multasPDF';

const Reportes = () => {
	const [reportes, setReportes] = useState({
		pagos: [],
		moras: [],
		reservas: [],
		multas: [],
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const cargarDatos = async () => {
			try {
				const [pagos, moras, reservas, multas] = await Promise.all([
					obtenerPagos(),
					obtenerMoras(),
					obtenerReservas(),
					obtenerMultas(),
				]);

				// ✅ SOLO UN setState

				setReportes({
					pagos: pagos || [],
					moras: moras || [],
					reservas: reservas || [],
					multas: multas || [],
				});
			} catch (error) {
				console.error('Error cargando reportes:', error);
			} finally {
				setLoading(false);
			}
		};

		cargarDatos();
	}, []);

	if (loading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-10 h-10 border-2 border-borde border-t-primario rounded-full animate-spin" />
					<span className="text-secundario text-sm font-medium tracking-wide">
						Cargando reportería...
					</span>
				</div>
			</div>
		);
	}

	const exportButtons = [
		{
			label: 'Exportar Pagos',
			onClick: () => generarPDFPagos(reportes.pagos),
			icon: CreditCard,
			accentClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40',
		},
		{
			label: 'Exportar Moras',
			onClick: () => generarPDFMoras(reportes.moras),
			icon: AlertTriangle,
			accentClass: 'text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40',
		},
		{
			label: 'Exportar Reservas',
			onClick: () => generarPDFReservas(reportes.reservas),
			icon: CalendarDays,
			accentClass: 'text-violet-400 bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20 hover:border-violet-500/40',
		},
		{
			label: 'Exportar Multas',
			onClick: () => generarPDFMultas(reportes.multas),
			icon: Gavel,
			accentClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40',
		},
	];

	const metricCards = [
		{
			label: 'Pagos',
			value: reportes.pagos?.data?.length ?? reportes.pagos?.length ?? 0,
			icon: CreditCard,
			bg: 'bg-emerald-500/10',
		},
		{
			label: 'Moras',
			value: reportes.moras?.data?.length ?? reportes.moras?.length ?? 0,
			icon: AlertTriangle,
			bg: 'bg-red-500/10',
		},
		{
			label: 'Reservas',
			value: reportes.reservas?.data?.length ?? reportes.reservas?.length ?? 0,
			icon: CalendarDays,
			bg: 'bg-violet-500/10',
		},
		{
			label: 'Multas',
			value: reportes.multas?.data?.length ?? reportes.multas?.length ?? 0,
			icon: Gavel,
			bg: 'bg-amber-500/10',
		},
	];

	return (
		<div className="space-y-8 animate-in fade-in duration-300">
			{/* ===== HEADER ===== */}
			<div>
				<div className="flex items-center gap-3 mb-1">
					<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10">
						<BarChart3 className="w-5 h-5 text-emerald-400" />
					</div>
					<h1 className="text-2xl font-black text-primario">Dashboard de Reportes</h1>
				</div>
				<p className="text-secundario mt-1 ml-12">
					Sistema de reportería y análisis del condominio
				</p>
			</div>

			{/* ===== METRIC CARDS ===== */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{metricCards.map((card) => (
					<div
						key={card.label}
						className="p-5 border bg-fondo border-borde rounded-xl shadow-sm hover:border-zinc-700 transition-colors"
					>
						<div className="flex items-center justify-between mb-3">
							<span className="text-xs font-medium text-secundario">{card.label}</span>
							<div className={`flex items-center justify-center w-8 h-8 rounded-lg ${card.bg}`}>
								<card.icon className="w-4 h-4 text-primario" />
							</div>
						</div>
						<p className="text-2xl font-bold font-title text-primario">{card.value}</p>
					</div>
				))}
			</div>

			{/* ===== QUICK EXPORTS ===== */}
			<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
				<div className="flex items-center gap-2 p-4 border-b border-borde bg-tarjeta/50">
					<Download className="w-4 h-4 text-secundario" />
					<span className="text-[11px] font-bold uppercase tracking-wide text-secundario">
						Reportes Rápidos — Exportar a PDF
					</span>
				</div>

				<div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					{exportButtons.map((btn) => (
						<button
							key={btn.label}
							onClick={btn.onClick}
							className={`
								group flex items-center gap-3 px-4 py-3 rounded-lg
								border font-semibold text-sm
								transition-all duration-200
								cursor-pointer
								active:scale-[0.97]
								${btn.accentClass}
							`}
						>
							<div className="flex items-center justify-center w-8 h-8 rounded-md bg-black/20 group-hover:bg-black/30 transition-colors">
								<btn.icon className="w-4 h-4" />
							</div>
							<div className="flex flex-col items-start">
								<span className="leading-tight">{btn.label}</span>
								<span className="text-[10px] opacity-60 font-normal">PDF</span>
							</div>
							<FileText className="w-3.5 h-3.5 ml-auto opacity-40 group-hover:opacity-70 transition-opacity" />
						</button>
					))}
				</div>
			</div>

			{/* ===== CHARTS ===== */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<GraficaPagos data={reportes.pagos} />
				<GraficaMoras data={reportes.moras} />
				<GraficaReservas data={reportes.reservas} />
				<GraficaMultas data={reportes.multas} />
			</div>
		</div>
	);
};

export default Reportes;
