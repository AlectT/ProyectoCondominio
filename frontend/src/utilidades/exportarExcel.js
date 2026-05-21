import * as XLSX from 'xlsx';

export const exportarAExcel = (datos, nombreArchivo = 'reporte') => {
    if (!datos || datos.length === 0) {
        console.warn('No hay datos para exportar.');
        return;
    }

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    
    XLSX.utils.book_append_sheet(libro, hoja, 'Reporte');
    
    XLSX.writeFile(libro, `${nombreArchivo}_${new Date().getTime()}.xlsx`);
};
