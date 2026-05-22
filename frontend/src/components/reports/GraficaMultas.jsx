import {
	ResponsiveContainer,
	AreaChart,
	Area,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="p-3 rounded-lg shadow-xl bg-tarjeta border border-borde">
				<p className="text-xs text-secundario mb-1">Propiedad</p>
				<p className="font-semibold text-primario">{label}</p>
				<div className="mt-2 pt-2 border-t border-borde">
					<p className="text-xs text-secundario">Monto multa</p>
					<p className="font-bold text-amber-400">
						Q{Number(payload[0].value).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
					</p>
				</div>
			</div>
		);
	}
	return null;
};

const GraficaMultas = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		propiedad: item.NUMERO_PROPIEDAD,
		monto: Number(item.MONTO),
	}));

	return (
		<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
			<div className="px-5 py-4 border-b border-borde bg-tarjeta/50">
				<h2 className="text-sm font-bold text-primario">Multas Generadas</h2>
				<p className="text-xs text-secundario mt-0.5">Control de multas aplicadas</p>
			</div>

			<div className="p-5">
				<ResponsiveContainer width="100%" height={320}>
					<AreaChart data={datosGrafica} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
						<defs>
							<linearGradient id="gradientMultas" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#fbbf24" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
						<XAxis dataKey="propiedad" stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
						<YAxis stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
						<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
						<Area
							type="monotone"
							dataKey="monto"
							stroke="#fbbf24"
							fill="url(#gradientMultas)"
							strokeWidth={2.5}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default GraficaMultas;
