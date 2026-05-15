import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFMultas = (data) => {
	const doc = new jsPDF();

	// ===== HEADER =====

	doc.setFillColor(11, 17, 32);

	doc.rect(0, 0, 220, 30, 'F');

	doc.setTextColor(234, 179, 8);

	doc.setFontSize(22);

	doc.text('REPORTE DE MULTAS', 14, 18);

	doc.setFontSize(10);

	doc.setTextColor(180);

	doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 25);

	// ===== TABLA =====

	autoTable(doc, {
		startY: 40,

		theme: 'grid',

		headStyles: {
			fillColor: [234, 179, 8],
			textColor: [0, 0, 0],
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

		head: [['ID', 'Propiedad', 'Administrador', 'Tipo Multa', 'Monto', 'Descripción', 'Fecha']],

		body: data.data.map((item) => [
			item.ID_LLAMADO,
			item.NUMERO_PROPIEDAD,
			item.ADMINISTRADOR,
			item.TIPO_MULTA,
			`Q ${item.MONTO}`,
			item.DESCRIPCION,

			new Date(item.FECHA_EMISION).toLocaleDateString(),
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

	doc.save('reporte-multas.pdf');
};
