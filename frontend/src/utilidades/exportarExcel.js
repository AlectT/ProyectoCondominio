import * as ExcelJS from 'exceljs';

/**
 * Exporta datos a Excel con una hoja de datos y, opcionalmente,
 * incrusta las imágenes de las gráficas dentro de la misma hoja.
 *
 * @param {Array<Object>}        datos           - Filas de datos.
 * @param {string}               nombreArchivo   - Nombre base del archivo.
 * @param {string[]|string|null} imagenesGrafico - Array de base64 PNG, o un solo string, o null.
 */
export const exportarAExcel = async (datos, nombreArchivo = 'reporte', imagenesGrafico = null) => {
    if (!datos || datos.length === 0) {
        console.warn('No hay datos para exportar.');
        return;
    }

    // Normalizar a array
    const imagenes = !imagenesGrafico
        ? []
        : Array.isArray(imagenesGrafico)
            ? imagenesGrafico
            : [imagenesGrafico];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema de Gestión Condominio';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Datos y Gráficas');

    // ── 1. Construir las columnas ────────────────────────────────────────────
    const keys = Object.keys(datos[0]);
    sheet.columns = keys.map(key => {
        // Calcular el ancho de columna (máximo entre el título y el valor más largo)
        const maxLen = Math.max(
            key.length,
            ...datos.map(row => String(row[key] ?? '').length)
        );
        return {
            header: key,
            key: key,
            width: Math.min(maxLen + 4, 40)
        };
    });

    // Estilo para los encabezados
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF18181B' } // Fondo oscuro tipo zinc-900
    };

    // ── 2. Agregar los datos ─────────────────────────────────────────────────
    datos.forEach(fila => {
        sheet.addRow(fila);
    });

    // ── 3. Incrustar Gráficas (si hay) ───────────────────────────────────────
    if (imagenes.length > 0) {
        // Dejar unas filas en blanco después de la tabla
        let currentRow = datos.length + 3;

        sheet.getCell(`A${currentRow}`).value = 'VISUALIZACIONES DEL REPORTE';
        sheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
        currentRow += 2;

        for (const base64Img of imagenes) {
            // El base64 viene con prefijo 'data:image/png;base64,...'
            // exceljs requiere solo la parte base64
            const base64Data = base64Img.split(',')[1];
            
            if (!base64Data) continue;

            const imageId = workbook.addImage({
                base64: base64Data,
                extension: 'png',
            });

            // Agregamos la imagen a la hoja.
            // Dimensiones aproximadas: ajustamos columnas y filas
            // Un gráfico típico nuestro mide ~700x350px.
            // Para excel, tl (top-left) y br (bottom-right) determinan su ubicación
            sheet.addImage(imageId, {
                tl: { col: 0, row: currentRow },
                ext: { width: 800, height: 400 }
            });

            // Mover la fila para la siguiente imagen (400px en Excel son unas ~20 filas estándar)
            currentRow += 23;
        }
    }

    // ── 4. Generar y Descargar Archivo ───────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreArchivo}_${new Date().getTime()}.xlsx`;
    link.click();
    
    // Limpiar objeto URL
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
    }, 100);
};
