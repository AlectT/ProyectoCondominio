import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFReservas = (data) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	// ===== HEADER PREMIUM =====
	doc.setFillColor(9, 9, 11);
	doc.rect(0, 0, pageWidth, 45, 'F');

	// Línea de acento violeta
	doc.setFillColor(167, 139, 250);
	doc.rect(0, 45, pageWidth, 1.5, 'F');

	// Título
	doc.setTextColor(250, 250, 250);
	doc.setFontSize(20);
	doc.setFont('helvetica', 'bold');
	doc.text('REPORTE DE RESERVAS', 14, 20);

	// Subtítulo
	doc.setFontSize(9);
	doc.setTextColor(161, 161, 170);
	doc.text('Sistema de Gestión Condominio', 14, 28);

	// Fecha
	doc.setFontSize(8);
	doc.setTextColor(113, 113, 122);
	doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 36);

	// Badge
	const totalText = `${data.data.length} registros`;
	const tw = doc.getTextWidth(totalText) + 12;
	doc.setFillColor(167, 139, 250);
	doc.roundedRect(pageWidth - tw - 14, 16, tw, 10, 2, 2, 'F');
	doc.setTextColor(9, 9, 11);
	doc.setFontSize(8);
	doc.setFont('helvetica', 'bold');
	doc.text(totalText, pageWidth - tw - 14 + 6, 22.5);

	// ===== TABLA =====
	autoTable(doc, {
		startY: 54,
		theme: 'grid',
		headStyles: {
			fillColor: [24, 24, 27],
			textColor: [250, 250, 250],
			fontStyle: 'bold',
			fontSize: 8,
			cellPadding: 5,
			lineColor: [39, 39, 42],
			lineWidth: 0.3,
		},
		styles: {
			fillColor: [9, 9, 11],
			textColor: [212, 212, 216],
			lineColor: [39, 39, 42],
			lineWidth: 0.2,
			fontSize: 7.5,
			cellPadding: 4,
		},
		alternateRowStyles: {
			fillColor: [18, 18, 21],
		},
		columnStyles: {
			7: { textColor: [167, 139, 250], fontStyle: 'bold' },
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
			`Q ${Number(item.MONTO_TOTAL).toFixed(2)}`,
		]),
	});

	// ===== FOOTER =====
	const totalPages = doc.internal.getNumberOfPages();
	for (let i = 1; i <= totalPages; i++) {
		doc.setPage(i);
		const pageHeight = doc.internal.pageSize.getHeight();

		doc.setDrawColor(39, 39, 42);
		doc.setLineWidth(0.3);
		doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

		doc.setFontSize(7);
		doc.setTextColor(113, 113, 122);
		doc.setFont('helvetica', 'normal');
		doc.text('Condominio — Reporte de Reservas', 14, pageHeight - 10);
		doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
	}

	doc.save('reporte-reservas.pdf');
};
