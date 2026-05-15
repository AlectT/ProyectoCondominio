import {
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	Legend,
} from 'recharts';

const GraficaReservas = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		area: item.AREA_SOCIAL,
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
            border-purple-500/20
        "
		>
			<div className="mb-6">
				<h2
					className="
                    text-2xl
                    font-bold
                    text-purple-400
                "
				>
					Reservas Áreas Sociales
				</h2>

				<p className="text-gray-400">Ingresos por reservas</p>
			</div>

			<ResponsiveContainer width="100%" height={350}>
				<LineChart data={datosGrafica}>
					<CartesianGrid strokeDasharray="3 3" stroke="#374151" />

					<XAxis dataKey="area" stroke="#9CA3AF" />

					<YAxis stroke="#9CA3AF" />

					<Tooltip />

					<Legend />

					<Line type="monotone" dataKey="monto" stroke="#A855F7" strokeWidth={4} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default GraficaReservas;
