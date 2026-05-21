import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportarAPDF = (datos, nombreArchivo = 'reporte', titulo = 'Reporte Condominio') => {
    if (!datos || datos.length === 0) {
        console.warn('No hay datos para exportar.');
        return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(titulo, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generado el: ${new Date().toLocaleString('es-GT')}`, 14, 28);

    const columnas = Object.keys(datos[0]).map(key => ({ header: key, dataKey: key }));

    autoTable(doc, {
        columns: columnas,
        body: datos,
        startY: 34,
        theme: 'striped',
        headStyles: { fillColor: [0, 150, 100], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 250, 248] }
    });

    doc.save(`${nombreArchivo}_${new Date().getTime()}.pdf`);
};
