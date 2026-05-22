import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#a78bfa', '#f472b6', '#38bdf8'];

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="p-3 rounded-lg shadow-xl bg-tarjeta border border-borde">
				<p className="text-xs text-secundario mb-1">Propiedad</p>
				<p className="font-semibold text-primario">{payload[0].name}</p>
				<div className="mt-2 pt-2 border-t border-borde">
					<p className="text-xs text-secundario">Monto mora</p>
					<p className="font-bold text-red-400">
						Q{Number(payload[0].value).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
					</p>
				</div>
			</div>
		);
	}
	return null;
};

const GraficaMoras = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		propiedad: item.NUMERO_PROPIEDAD,
		mora: Number(item.MONTO),
	}));

	return (
		<div className="border bg-fondo border-borde rounded-xl overflow-hidden shadow-sm">
			<div className="px-5 py-4 border-b border-borde bg-tarjeta/50">
				<h2 className="text-sm font-bold text-primario">Moras Generadas</h2>
				<p className="text-xs text-secundario mt-0.5">Distribución de moras pendientes</p>
			</div>

			<div className="p-5">
				<ResponsiveContainer width="100%" height={320}>
					<PieChart>
						<Pie data={datosGrafica} dataKey="mora" nameKey="propiedad" outerRadius={110} innerRadius={50} paddingAngle={2} label>
							{datosGrafica.map((_, index) => (
								<Cell key={index} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip content={<CustomTooltip />} />
						<Legend
							wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default GraficaMoras;
