import {
	ResponsiveContainer,
	BarChart,
	Bar,
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
					<p className="text-xs text-secundario">Monto</p>
					<p className="font-bold text-emerald-400">
						Q{Number(payload[0].value).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
					</p>
				</div>
			</div>
		);
	}
	return null;
};

const GraficaPagos = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		propiedad: item.NUMERO_PROPIEDAD,
		monto: Number(item.MONTO_TOTAL),
	}));

	return (
		<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
			<div className="px-5 py-4 border-b border-borde bg-tarjeta/50">
				<h2 className="text-sm font-bold text-primario">Pagos Realizados</h2>
				<p className="text-xs text-secundario mt-0.5">Comparativa de pagos por propiedad</p>
			</div>

			<div className="p-5">
				<ResponsiveContainer width="100%" height={320}>
					<BarChart data={datosGrafica} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
						<XAxis dataKey="propiedad" stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
						<YAxis stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
						<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
						<Bar dataKey="monto" fill="#34d399" radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default GraficaPagos;
