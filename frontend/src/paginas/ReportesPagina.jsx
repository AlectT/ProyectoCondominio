import { ConfiguradorReporte } from '../componentes/reports/ConfiguradorReporte.jsx';

export default function ReportesPagina() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-black text-primario">Analítica Dinámica</h1>
                <p className="text-secundario mt-1">Construye consultas personalizadas y visualiza los datos en tiempo real.</p>
            </div>

            <ConfiguradorReporte />
        </div>
    );
}
