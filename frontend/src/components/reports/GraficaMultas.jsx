import {
	ResponsiveContainer,
	AreaChart,
	Area,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	Legend,
} from 'recharts';

const GraficaMultas = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		propiedad: item.NUMERO_PROPIEDAD,
		monto: Number(item.MONTO),
	}));

	return (
		<div
			className="
            bg-[#111827]
            rounded-2xl
            p-6
            shadow-lg
            border
            border-yellow-500/20
        "
		>
			{/* ===== HEADER ===== */}

			<div className="mb-6">
				<h2
					className="
                    text-2xl
                    font-bold
                    text-yellow-400
                "
				>
					Multas Generadas
				</h2>

				<p className="text-gray-400">Control de multas aplicadas</p>
			</div>

			{/* ===== CHART ===== */}

			<ResponsiveContainer width="100%" height={350}>
				<AreaChart data={datosGrafica}>
					<CartesianGrid strokeDasharray="3 3" stroke="#374151" />

					<XAxis dataKey="propiedad" stroke="#9CA3AF" />

					<YAxis stroke="#9CA3AF" />

					<Tooltip />

					<Legend />

					<Area
						type="monotone"
						dataKey="monto"
						stroke="#FACC15"
						fill="#FACC15"
						fillOpacity={0.25}
						strokeWidth={3}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default GraficaMultas;
