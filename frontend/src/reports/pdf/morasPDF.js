import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFMoras = (data) => {
	const doc = new jsPDF();

	// ===== HEADER =====

	doc.setFillColor(11, 17, 32);

	doc.rect(0, 0, 220, 30, 'F');

	doc.setTextColor(244, 63, 94);

	doc.setFontSize(22);

	doc.text('REPORTE DE MORAS', 14, 18);

	doc.setFontSize(10);

	doc.setTextColor(180);

	doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 25);

	// ===== TABLA =====

	autoTable(doc, {
		startY: 40,

		theme: 'grid',

		headStyles: {
			fillColor: [244, 63, 94],
			textColor: [255, 255, 255],
			fontStyle: 'bold',
		},

		styles: {
			fillColor: [17, 24, 39],
			textColor: [255, 255, 255],
			lineColor: [55, 65, 81],
			lineWidth: 0.2,
		},

		alternateRowStyles: {
			fillColor: [31, 41, 55],
		},

		head: [
			[
				'ID Cargo',
				'Propiedad',
				'Tipo Cargo',
				'Monto',
				'Estado',
				'Fecha Emisión',
				'Vencimiento',
				'Días Mora',
			],
		],

		body: data.data.map((item) => [
			item.ID_CARGO,
			item.NUMERO_PROPIEDAD,
			item.TIPO_CARGO,
			`Q ${item.MONTO}`,
			item.ESTADO,

			new Date(item.FECHA_EMISION).toLocaleDateString(),

			new Date(item.FECHA_VENCIMIENTO).toLocaleDateString(),

			item.DIAS_MORA,
		]),
	});

	// ===== FOOTER =====

	const totalPages = doc.internal.getNumberOfPages();

	for (let i = 1; i <= totalPages; i++) {
		doc.setPage(i);

		doc.setFontSize(10);

		doc.setTextColor(120);

		doc.text(`Página ${i} de ${totalPages}`, 180, 290);
	}

	doc.save('reporte-moras.pdf');
};
