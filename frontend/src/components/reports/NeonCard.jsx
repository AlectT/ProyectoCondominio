const NeonCard = ({ titulo, valor, color }) => {
	return (
		<div
			className="
            bg-[#111827]
            rounded-2xl
            border
            p-6
            shadow-lg
        "
		>
			<h3 className="text-gray-400 mb-2">{titulo}</h3>

			<p
				className={`
                text-4xl
                font-bold
                text-${color}-400
            `}
			>
				{valor}
			</p>
		</div>
	);
};

export default NeonCard;
