import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFReservas = (data) => {
	const doc = new jsPDF();

	// ===== HEADER =====

	doc.setFillColor(11, 17, 32);

	doc.rect(0, 0, 220, 30, 'F');

	doc.setTextColor(168, 85, 247);

	doc.setFontSize(22);

	doc.text('REPORTE DE RESERVAS', 14, 18);

	doc.setFontSize(10);

	doc.setTextColor(180);

	doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 25);

	// ===== TABLA =====

	autoTable(doc, {
		startY: 40,

		theme: 'grid',

		headStyles: {
			fillColor: [168, 85, 247],
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
			['ID', 'Usuario', 'Área Social', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Estado', 'Monto'],
		],

		body: data.data.map((item) => [
			item.ID_RESERVA,
			item.USUARIO,
			item.AREA_SOCIAL,

			new Date(item.FECHA_RESERVA).toLocaleDateString(),

			item.HORA_INICIO,
			item.HORA_FIN,
			item.ESTADO,
			`Q ${item.MONTO_TOTAL}`,
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

	doc.save('reporte-reservas.pdf');
};
