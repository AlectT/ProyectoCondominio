import { useEffect, useState } from 'react';

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

import NeonCard from '../components/reports/NeonCard';

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
			<div
				className="
                min-h-screen
                flex
                items-center
                justify-center
                text-cyan-400
                text-3xl
                font-bold
            "
			>
				Cargando reportería...
			</div>
		);
	}

	return (
		<div
			className="
            min-h-screen
            text-white
            p-8
        "
		>
			<div className="mb-10">
				<h1
					className="
                    text-5xl
                    font-black
                    text-cyan-400
                "
				>
					Dashboard Condominio
				</h1>

				<p className="text-gray-400 mt-2">Sistema de reportería y análisis</p>
			</div>

			{/* ===== CARDS ===== */}

			<div
				className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-5
                gap-6
                mb-10
            "
			>
				<NeonCard titulo="Pagos" valor={reportes.pagos.length} color="cyan" />

				<NeonCard titulo="Moras" valor={reportes.moras.length} color="pink" />

				<NeonCard titulo="Reservas" valor={reportes.reservas.length} color="purple" />

				<NeonCard titulo="Multas" valor={reportes.multas.length} color="yellow" />
			</div>
			<div
				className="
    flex
    flex-wrap
    gap-4
    mb-10
"
			>
				<button
					onClick={() => generarPDFPagos(reportes.pagos)}
					className="
            bg-cyan-500
            hover:bg-cyan-400
            text-black
            px-5
            py-3
            rounded-xl
            font-bold
            transition
        "
				>
					Exportar Pagos PDF
				</button>

				<button
					onClick={() => generarPDFMoras(reportes.moras)}
					className="
            bg-pink-500
            hover:bg-pink-400
            text-white
            px-5
            py-3
            rounded-xl
            font-bold
            transition
        "
				>
					Exportar Moras PDF
				</button>

				<button
					onClick={() => generarPDFReservas(reportes.reservas)}
					className="
            bg-purple-500
            hover:bg-purple-400
            text-white
            px-5
            py-3
            rounded-xl
            font-bold
            transition
        "
				>
					Exportar Reservas PDF
				</button>

				<button
					onClick={() => generarPDFMultas(reportes.multas)}
					className="
            bg-yellow-400
            hover:bg-yellow-300
            text-black
            px-5
            py-3
            rounded-xl
            font-bold
            transition
        "
				>
					Exportar Multas PDF
				</button>
			</div>
			<div
				className="
    grid
    grid-cols-1
    lg:grid-cols-2
    gap-8
"
			>
				<GraficaPagos data={reportes.pagos} />

				<GraficaMoras data={reportes.moras} />

				<GraficaReservas data={reportes.reservas} />

				<GraficaMultas data={reportes.multas} />
			</div>
		</div>
	);
};

export default Reportes;
