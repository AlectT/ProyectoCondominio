const NeonTable = ({ columns, data }) => {
	return (
		<div
			className="
            bg-[#111827]
            rounded-2xl
            p-6
        "
		>
			<table className="w-full text-white">
				<thead>
					<tr className="border-b border-cyan-400">
						{columns.map((column, index) => (
							<th key={index} className="p-4 text-left">
								{column.header}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex} className="border-b border-gray-700">
							{columns.map((column, colIndex) => (
								<td key={colIndex} className="p-4">
									{row[column.accessor]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default NeonTable;
