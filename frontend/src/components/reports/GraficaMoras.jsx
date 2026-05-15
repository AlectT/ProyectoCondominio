import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const COLORS = ['#F43F5E', '#FB7185', '#FDA4AF', '#FFE4E6'];

const GraficaMoras = ({ data }) => {
	const datosGrafica = data.data.map((item) => ({
		propiedad: item.NUMERO_PROPIEDAD,
		mora: Number(item.MONTO),
	}));

	return (
		<div
			className="
            bg-[#111827]
            rounded-2xl
            p-6
            shadow-lg
            border
            border-pink-500/20
        "
		>
			<div className="mb-6">
				<h2
					className="
                    text-2xl
                    font-bold
                    text-pink-400
                "
				>
					Moras Generadas
				</h2>

				<p className="text-gray-400">Distribución de moras pendientes</p>
			</div>

			<ResponsiveContainer width="100%" height={350}>
				<PieChart>
					<Pie data={datosGrafica} dataKey="mora" nameKey="propiedad" outerRadius={120} label>
						{datosGrafica.map((_, index) => (
							<Cell key={index} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>

					<Tooltip />

					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default GraficaMoras;
