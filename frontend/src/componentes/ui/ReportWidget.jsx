import {
    BarChart, Bar,
    LineChart, Line,
    AreaChart, Area,
    PieChart, Pie, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── Paleta de colores para Pie/Donut ────────────────────────────────────────
const COLORES_PIE = [
    '#34d399', '#38bdf8', '#a78bfa', '#f87171', '#fbbf24',
    '#fb923c', '#f472b6', '#2dd4bf', '#818cf8', '#facc15',
];

// ─── Tipos de gráfico disponibles ────────────────────────────────────────────
export const TIPOS_GRAFICO = [
    { id: 'bar',    nombre: 'Barras Verticales',   emoji: '📊' },
    { id: 'barH',   nombre: 'Barras Horizontales', emoji: '📶' },
    { id: 'line',   nombre: 'Líneas',              emoji: '📈' },
    { id: 'area',   nombre: 'Área',                emoji: '🏔️' },
    { id: 'pie',    nombre: 'Pastel',              emoji: '🥧' },
    { id: 'donut',  nombre: 'Dona',                emoji: '🍩' },
    { id: 'radar',  nombre: 'Radar',               emoji: '🕸️' },
];

// ─── Tooltip reutilizable ────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, nombreDimension, nombreMetrica }) => {
    if (active && payload && payload.length) {
        const itemLabel = label ?? payload[0]?.name ?? '';
        return (
            <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} className="p-3 rounded-lg shadow-xl">
                <p className="text-xs text-zinc-400 mb-1">{nombreDimension || 'Categoría'}</p>
                <p className="font-semibold text-white truncate max-w-[200px]">{itemLabel}</p>
                <div className="mt-2 pt-2 border-t border-zinc-700">
                    <p className="text-xs text-zinc-400">{nombreMetrica || 'Valor'}</p>
                    <p className="font-bold" style={{ color: payload[0].fill ?? payload[0].stroke ?? '#34d399' }}>
                        {Number(payload[0].value).toLocaleString('es-GT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CustomXAxisTick = ({ x, y, payload }) => {
    const maxLen = 12;
    const text = payload.value?.toString() ?? '';
    const display = text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={14} textAnchor="end" fill="#a1a1aa" fontSize={11} transform="rotate(-30)">
                {display}
            </text>
        </g>
    );
};

const CustomYAxisTick = ({ x, y, payload }) => {
    const maxLen = 14;
    const text = payload.value?.toString() ?? '';
    const display = text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={-4} y={0} dy={4} textAnchor="end" fill="#a1a1aa" fontSize={11}>
                {display}
            </text>
        </g>
    );
};

// ─── Componente principal ────────────────────────────────────────────────────
export function ReportWidget(
    { data, colorPrimario = '#34d399', nombreDimension, nombreMetrica, tipoGrafico = 'bar' }
) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-secundario text-sm border border-borde border-dashed rounded-lg">
                No hay datos para mostrar con la configuración actual.
            </div>
        );
    }

    const commonGrid = <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />;
    const commonXAxis = (
        <XAxis dataKey="label" tick={<CustomXAxisTick />} interval={0} stroke="#52525b" />
    );
    const commonYAxis = <YAxis stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />;
    const commonTooltip = (
        <Tooltip
            content={<CustomTooltip nombreDimension={nombreDimension} nombreMetrica={nombreMetrica} />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
    );
    const commonLegend = (
        <Legend
            formatter={() => nombreMetrica || 'Valor'}
            wrapperStyle={{ color: colorPrimario, fontSize: 12, paddingTop: 8 }}
        />
    );

    const renderChart = () => {
        switch (tipoGrafico) {
            // ── Barras verticales ──
            case 'bar':
                return (
                    <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 50 }}>
                        {commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}{commonLegend}
                        <Bar dataKey="value" name={nombreMetrica || 'Valor'} radius={[4, 4, 0, 0]}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                );

            // ── Barras horizontales ──
            case 'barH':
                return (
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                    >
                        {commonGrid}
                        <XAxis type="number" stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
                        <YAxis type="category" dataKey="label" tick={<CustomYAxisTick />} width={80} stroke="#52525b" />
                        {commonTooltip}{commonLegend}
                        <Bar dataKey="value" name={nombreMetrica || 'Valor'} radius={[0, 4, 4, 0]}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                );

            // ── Líneas ──
            case 'line':
                return (
                    <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 50 }}>
                        {commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}{commonLegend}
                        <Line
                            type="monotone" dataKey="value" name={nombreMetrica || 'Valor'}
                            stroke={colorPrimario} strokeWidth={2.5}
                            dot={{ fill: colorPrimario, stroke: '#09090b', strokeWidth: 2, r: 4 }}
                            activeDot={{ fill: '#fff', stroke: colorPrimario, strokeWidth: 2, r: 6 }}
                        />
                    </LineChart>
                );

            // ── Área ──
            case 'area':
                return (
                    <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 50 }}>
                        <defs>
                            <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colorPrimario} stopOpacity={0.35} />
                                <stop offset="95%" stopColor={colorPrimario} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        {commonGrid}{commonXAxis}{commonYAxis}{commonTooltip}{commonLegend}
                        <Area
                            type="monotone" dataKey="value" name={nombreMetrica || 'Valor'}
                            stroke={colorPrimario} fill="url(#gradArea)" strokeWidth={2.5}
                        />
                    </AreaChart>
                );

            // ── Pastel ──
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data} dataKey="value" nameKey="label"
                            outerRadius="80%" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={{ stroke: '#52525b' }}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip nombreDimension={nombreDimension} nombreMetrica={nombreMetrica} />} />
                        <Legend wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }} />
                    </PieChart>
                );

            // ── Dona ──
            case 'donut':
                return (
                    <PieChart>
                        <Pie
                            data={data} dataKey="value" nameKey="label"
                            innerRadius="45%" outerRadius="80%" paddingAngle={2}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={{ stroke: '#52525b' }}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip nombreDimension={nombreDimension} nombreMetrica={nombreMetrica} />} />
                        <Legend wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }} />
                    </PieChart>
                );

            // ── Radar ──
            case 'radar':
                return (
                    <RadarChart data={data} outerRadius="75%">
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="label" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                        <PolarRadiusAxis stroke="#52525b" tick={{ fill: '#a1a1aa', fontSize: 9 }} />
                        <Tooltip content={<CustomTooltip nombreDimension={nombreDimension} nombreMetrica={nombreMetrica} />} />
                        <Radar
                            name={nombreMetrica || 'Valor'} dataKey="value"
                            stroke={colorPrimario} fill={colorPrimario} fillOpacity={0.25}
                        />
                        <Legend wrapperStyle={{ fontSize: 11, color: '#a1a1aa', paddingTop: 8 }} />
                    </RadarChart>
                );

            default:
                return null;
        }
    };

    const alturaGrafico = ['pie', 'donut', 'radar'].includes(tipoGrafico) ? 380 : 320;

    return (
        <div className="w-full" style={{ height: alturaGrafico, background: '#09090b', borderRadius: 8, padding: '12px 4px 4px 4px' }}>
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
}

