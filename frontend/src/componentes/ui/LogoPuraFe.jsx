import { useState } from 'react';

export default function LogoPuraFe({
	className = 'w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] h-auto mx-auto',
}) {
	// Estado para controlar la animación de "Rebote" al hacer clic
	const [clickActivo, setClickActivo] = useState(false);

	const manejarClick = () => {
		setClickActivo(true);
		// Quitamos el efecto después de 200ms para que se vea como un "latido" o rebote
		setTimeout(() => setClickActivo(false), 200);
	};

	return (
		<div
			className={`cursor-pointer transition-transform duration-200 ease-in-out select-none flex justify-center items-center ${clickActivo ? 'scale-95' : 'hover:scale-105'} ${className}`}
			onClick={manejarClick}
			title="Condominio PuraFé"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 400 200"
				className="w-full h-full drop-shadow-md hover:drop-shadow-xl transition-all duration-500"
			>
				{/* GRUPO 1: El Símbolo (Montaña y Hoja) */}
				<g transform="translate(0, -10)" className="group">
					{/* Techo/Montaña Izquierda */}
					<path
						d="M 140 120 L 200 50 L 225 80"
						fill="none"
						className="stroke-[#064e3b] transition-all duration-500 group-hover:stroke-emerald-500 group-hover:-translate-y-2"
						strokeWidth="10"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Base de la Montaña */}
					<path
						d="M 140 120 L 260 120 L 225 80"
						fill="none"
						className="stroke-[#064e3b] transition-all duration-500 group-hover:stroke-emerald-600"
						strokeWidth="10"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Hoja Viva */}
					<path
						d="M 200 85 C 230 55, 270 50, 270 50 C 270 50, 250 100, 200 85 Z"
						fill="none"
						className="stroke-[#10b981] transition-all duration-500 origin-[200px_85px] group-hover:rotate-6 group-hover:scale-110 group-hover:stroke-emerald-400"
						strokeWidth="8"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>

				{/* GRUPO 2: Tipografía Principal */}
				<text
					x="200"
					y="165"
					fontFamily="system-ui, -apple-system, sans-serif"
					fontSize="52"
					fontWeight="900"
					textAnchor="middle"
					letterSpacing="1"
				>
					<tspan className="fill-[#064e3b] transition-colors duration-300 hover:fill-emerald-500">
						Pura
					</tspan>
					<tspan className="fill-[#10b981] transition-colors duration-300 hover:fill-emerald-300">
						Fé
					</tspan>
				</text>

				{/* GRUPO 3: Subtítulo Expansivo */}
				<text
					x="200"
					y="190"
					fontFamily="system-ui, -apple-system, sans-serif"
					fontSize="14"
					fontWeight="700"
					textAnchor="middle"
					className="fill-[#d97706] transition-all duration-500 hover:fill-amber-400 hover:tracking-[14px]"
					letterSpacing="10"
				>
					CONDOMINIO
				</text>
			</svg>
		</div>
	);
}
