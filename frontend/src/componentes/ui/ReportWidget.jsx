import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label, nombreDimension, nombreMetrica }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#18181b', borderColor: '#27272a', border: '1px solid #27272a' }} className="p-3 rounded-lg shadow-xl">
                <p className="text-xs text-zinc-400 mb-1">{nombreDimension || 'Categoría'}</p>
                <p className="font-semibold text-white truncate max-w-[200px]">{label}</p>
                <div className="mt-2 pt-2 border-t border-zinc-700">
                    <p className="text-xs text-zinc-400">{nombreMetrica || 'Valor'}</p>
                    <p className="font-bold" style={{ color: payload[0].fill }}>
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

export function ReportWidget({ data, colorPrimario = '#00ffb3', nombreDimension, nombreMetrica }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-secundario text-sm border border-borde border-dashed rounded-lg">
                No hay datos para mostrar con la configuración actual.
            </div>
        );
    }

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                    <XAxis
                        dataKey="label"
                        tick={<CustomXAxisTick />}
                        interval={0}
                        stroke="#52525b"
                    />
                    <YAxis stroke="#52525b" fontSize={11} tick={{ fill: '#a1a1aa' }} />
                    <Tooltip
                        content={<CustomTooltip nombreDimension={nombreDimension} nombreMetrica={nombreMetrica} />}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Legend
                        formatter={() => nombreMetrica || 'Valor'}
                        wrapperStyle={{ color: colorPrimario, fontSize: 12, paddingTop: 8 }}
                    />
                    <Bar dataKey="value" name={nombreMetrica || 'Valor'} fill={colorPrimario} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
