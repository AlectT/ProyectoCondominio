import {
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div className="p-3 rounded-lg shadow-xl bg-tarjeta border border-borde">
				<p className="text-xs text-secundario mb-1">Área social</p>
				<p className="font-semibold text-primario">{label}</p>
				<div className="mt-2 pt-2 border-t border-borde">
					<p className="text-xs text-secundario">Monto</p>
					<p className="font-bold text-violet-400">
						Q{Number(payload[0].value).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
					</p>
				</div>
			</div>
		);
	}
	return null;
};

const GraficaReservas = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		area: item.AREA_SOCIAL,
		monto: Number(item.MONTO_TOTAL),
	}));

	return (
		<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
			<div className="px-5 py-4 border-b border-borde bg-tarjeta/50">
				<h2 className="text-sm font-bold text-primario">Reservas Áreas Sociales</h2>
				<p className="text-xs text-secundario mt-0.5">Ingresos por reservas</p>
			</div>

			<div className="p-5">
				<ResponsiveContainer width="100%" height={320}>
					<LineChart data={datosGrafica} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
						<XAxis dataKey="area" stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
						<YAxis stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
						<Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
						<Line
							type="monotone"
							dataKey="monto"
							stroke="#a78bfa"
							strokeWidth={3}
							dot={{ fill: '#a78bfa', stroke: '#09090b', strokeWidth: 2, r: 5 }}
							activeDot={{ fill: '#c4b5fd', stroke: '#a78bfa', strokeWidth: 2, r: 7 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default GraficaReservas;
