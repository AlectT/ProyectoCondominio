import {
	ResponsiveContainer,
	BarChart,
	Bar,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

const GraficaPagos = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		propiedad: item.NUMERO_PROPIEDAD,
		monto: Number(item.MONTO_TOTAL),
	}));

	return (
		<div
			className="
            bg-[#111827]
            rounded-2xl
            p-6
            shadow-lg
            border
            border-cyan-500/20
        "
		>
			<div className="mb-6">
				<h2
					className="
                    text-2xl
                    font-bold
                    text-cyan-400
                "
				>
					Pagos Realizados
				</h2>

				<p className="text-gray-400">Comparativa de pagos por propiedad</p>
			</div>

			<ResponsiveContainer width="100%" height={350}>
				<BarChart data={datosGrafica}>
					<CartesianGrid strokeDasharray="3 3" stroke="#374151" />

					<XAxis dataKey="propiedad" stroke="#9CA3AF" />

					<YAxis stroke="#9CA3AF" />

					<Tooltip />

					<Bar dataKey="monto" fill="#22D3EE" radius={[10, 10, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default GraficaPagos;
