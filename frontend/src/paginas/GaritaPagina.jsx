import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, X, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';

// Por ahora usa datos de prueba — el módulo de garita lo implementa otro equipo
import { invitacionesEjemplo } from '../datos/datosDePrueba.js';

export default function GaritaPagina() {
	const { codigo } = useParams();
	const navigate = useNavigate();
	const [autorizado, setAutorizado] = useState(false);
	const [codigoManual, setCodigoManual] = useState('');

	// Vista base: escáner
	if (!codigo) {
		return (
			<div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans">
				<header className="bg-zinc-900 p-4 border-b border-zinc-800 text-center">
					<h1 className="text-lg font-bold text-zinc-100">Control de Garita</h1>
					<p className="text-xs text-zinc-400">Condominio PuraFé</p>
				</header>
				<main className="flex-1 flex flex-col items-center justify-center p-6">
					<div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
						<Camera className="w-10 h-10 text-zinc-400" />
					</div>
					<h2 className="text-xl font-bold mb-2">Escáner Activo</h2>
					<p className="text-zinc-500 text-center mb-8">
						Apunta con la cámara al código QR del visitante o ingresa el código manualmente.
					</p>
					<div className="w-full max-w-sm flex gap-2">
						<input
							type="text"
							placeholder="Ej: QR-12345"
							value={codigoManual}
							onChange={(e) => setCodigoManual(e.target.value)}
							className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
						/>
						<button
							onClick={() => {
								if (codigoManual) navigate(`/garita/validar/${codigoManual}`);
							}}
							className="px-4 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
						>
							Buscar
						</button>
					</div>
				</main>
			</div>
		);
	}

	const invitacion = invitacionesEjemplo.find((i) => i.codigo === codigo);

	if (!invitacion) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6 font-sans">
				<div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
					<X className="w-8 h-8 text-red-500" />
				</div>
				<h1 className="text-2xl font-bold mb-2">QR Inválido</h1>
				<p className="text-zinc-400 text-center mb-8">
					Este código no existe en el sistema del condominio.
				</p>
				<button
					onClick={() => navigate('/garita')}
					className="px-6 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
				>
					Volver a Escanear
				</button>
			</div>
		);
	}

	const esValido = invitacion.estado === 'Pendiente' || invitacion.estado === 'Activo';

	return (
		<div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans">
			<header className="bg-zinc-900 p-4 border-b border-zinc-800 text-center">
				<h1 className="text-lg font-bold text-zinc-100">Control de Garita</h1>
				<p className="text-xs text-zinc-400">Condominio PuraFé</p>
			</header>
			<main className="flex-1 flex flex-col items-center justify-center p-6">
				{autorizado ? (
					<div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
						<div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
							<CheckCircle2 className="w-12 h-12 text-emerald-500" />
						</div>
						<h2 className="text-2xl font-bold text-emerald-400 mb-2">¡Acceso Autorizado!</h2>
						<p className="text-zinc-400 text-center mb-8">El visitante puede ingresar.</p>
						<button
							onClick={() => navigate('/garita')}
							className="px-6 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
						>
							Autorizar otro pase
						</button>
					</div>
				) : (
					<div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
						<div className="text-center mb-8">
							<div
								className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 ${esValido ? 'bg-sky-500/20 text-sky-400' : 'bg-red-500/20 text-red-400'}`}
							>
								Estado: {invitacion.estado.toUpperCase()}
							</div>
							<h2 className="text-2xl font-bold text-zinc-100">{invitacion.visitante}</h2>
							<p className="text-zinc-400 mt-1">Pase de tipo {invitacion.tipo}</p>
						</div>
						<div className="space-y-4 mb-8 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
							<div className="flex justify-between border-b border-zinc-800 pb-2">
								<span className="text-zinc-500 text-sm">Dirigiéndose a</span>
								<span className="text-zinc-100 font-bold">{invitacion.propiedad}</span>
							</div>
							<div className="flex justify-between border-b border-zinc-800 pb-2">
								<span className="text-zinc-500 text-sm">Autoriza</span>
								<span className="text-zinc-100 font-bold">{invitacion.residente}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-zinc-500 text-sm">Código QR</span>
								<span className="text-zinc-100 font-mono text-sm">{invitacion.codigo}</span>
							</div>
						</div>
						{esValido ? (
							<button
								onClick={() => setAutorizado(true)}
								className="w-full py-4 bg-emerald-500 text-zinc-950 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
							>
								<UserCheck className="w-5 h-5" /> Autorizar Ingreso
							</button>
						) : (
							<div className="space-y-4 text-center">
								<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
									<p className="text-red-400 font-bold flex items-center justify-center gap-2">
										<AlertTriangle className="w-5 h-5" /> Ingreso Denegado
									</p>
									<p className="text-red-400/80 text-xs mt-2">El código ya fue utilizado o caducó.</p>
								</div>
								<button
									onClick={() => navigate('/garita')}
									className="px-6 py-3 bg-zinc-800 w-full rounded-xl font-bold hover:bg-zinc-700 transition-colors"
								>
									Volver a Escanear
								</button>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
