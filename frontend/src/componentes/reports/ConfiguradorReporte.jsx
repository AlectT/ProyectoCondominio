import { useState, useEffect } from 'react';
import { BarChart3, Download, FileText, Plus, X, Play, Filter, Loader2, Info, Zap } from 'lucide-react';
import { BtnPrimario } from '../ui/Botones.jsx';
import { Campo, Entrada, Selector } from '../ui/Formularios.jsx';
import { ReportWidget } from '../ui/ReportWidget.jsx';
import { exportarAExcel } from '../../utilidades/exportarExcel.js';
import { exportarAPDF } from '../../utilidades/exportarPDF.js';
import { obtenerReporteDinamico } from '../../api/reportesApi.js';
import { toast } from 'sonner';

const TABLAS_TRANSACCIONALES = [
    { id: 'PAGO', nombre: 'Pagos' },
    { id: 'CARGO', nombre: 'Cargos Financieros' },
    { id: 'RESERVA', nombre: 'Reservas' },
    { id: 'TICKET', nombre: 'Tickets de Ayuda' },
    { id: 'LLAMADO_ATENCION', nombre: 'Llamados de Atención / Multas' },
    { id: 'INVITACION', nombre: 'Invitaciones (Visitas)' }
];

// Sin IDs — solo campos con significado de negocio. Incluye columnas de tablas relacionadas.
const CAMPOS_DISPONIBLES = {
    PAGO: [
        { id: 'USUARIO.nombre',             nombre: 'Nombre del Residente' },
        { id: 'PROPIEDAD.numero_propiedad', nombre: 'Número de Propiedad' },
        { id: 'PAGO.fecha_pago',            nombre: 'Fecha de Pago' },
        { id: 'PAGO.monto_total',           nombre: 'Monto Pagado' },
        { id: 'PAGO.estado',                nombre: 'Estado del Pago' },
    ],
    CARGO: [
        { id: 'USUARIO.nombre',             nombre: 'Nombre del Residente' },
        { id: 'PROPIEDAD.numero_propiedad', nombre: 'Número de Propiedad' },
        { id: 'TIPO_CARGO.nombre',          nombre: 'Tipo de Cargo (mora, cuota…)' },
        { id: 'CARGO.fecha_cargo',          nombre: 'Fecha del Cargo' },
        { id: 'CARGO.monto',               nombre: 'Monto del Cargo' },
        { id: 'CARGO.estado',              nombre: 'Estado del Cargo' },
    ],
    RESERVA: [
        { id: 'USUARIO.nombre',             nombre: 'Nombre del Residente' },
        { id: 'AREA_SOCIAL.nombre',         nombre: 'Área Social' },
        { id: 'RESERVA.fecha_reserva',      nombre: 'Fecha de Reserva' },
        { id: 'RESERVA.estado',             nombre: 'Estado de Reserva' },
    ],
    TICKET: [
        { id: 'USUARIO.nombre',             nombre: 'Asignado a' },
        { id: 'PRIORIDAD_TICKET.nombre',    nombre: 'Prioridad' },
        { id: 'TICKET.fecha_creacion',      nombre: 'Fecha de Creación' },
        { id: 'TICKET.estado',              nombre: 'Estado del Ticket' },
    ],
    LLAMADO_ATENCION: [
        { id: 'USUARIO.nombre',             nombre: 'Residente infractor' },
        { id: 'PROPIEDAD.numero_propiedad', nombre: 'Propiedad sancionada' },
        { id: 'TIPO_CARGO.nombre',          nombre: 'Motivo de la Sanción' },
        { id: 'LLAMADO_ATENCION.fecha_emision', nombre: 'Fecha de Emisión' },
        { id: 'LLAMADO_ATENCION.estado',    nombre: 'Estado' },
    ],
    INVITACION: [
        { id: 'USUARIO.nombre',             nombre: 'Anfitrión (residente)' },
        { id: 'TIPO_INVITACION.nombre',     nombre: 'Tipo de Visita' },
        { id: 'INVITACION.fecha_creacion',  nombre: 'Fecha de Creación' },
        { id: 'INVITACION.fecha_visita',    nombre: 'Fecha de Visita' },
        { id: 'INVITACION.estado',          nombre: 'Estado' },
    ]
};

// Solo campos numéricos válidos para SUM / AVG.
// COUNT siempre usa COUNT(1) internamente, así que esos campos solo aplican para SUM/AVG.
const CAMPOS_METRICA = {
    PAGO:             [{ id: 'PAGO.monto_total',  nombre: 'Monto Pagado' }],
    CARGO:            [{ id: 'CARGO.monto',        nombre: 'Monto del Cargo' }],
    RESERVA:          [],   // sin campos numéricos — solo COUNT
    TICKET:           [],
    LLAMADO_ATENCION: [],
    INVITACION:       [],
};

// Para LLAMADO_ATENCION necesitamos USUARIO a través de la propiedad
// Agregamos el nodo USUARIO → PROPIEDAD → USUARIO_PROPIEDAD a schemaGraph (ya existe)

const getNombreCampo = (baseEntity, fieldId) => {
    const enDim = CAMPOS_DISPONIBLES[baseEntity]?.find(c => c.id === fieldId);
    if (enDim) return enDim.nombre;
    const enMet = CAMPOS_METRICA[baseEntity]?.find(c => c.id === fieldId);
    return enMet?.nombre ?? fieldId;
};

/** Normaliza keys de objetos a minúsculas (Oracle devuelve TODO en mayúsculas) */
const normalizarClaves = (arr) =>
    arr.map(row => Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v])));

// ─── Reportes predefinidos ────────────────────────────────────────────────────
const REPORTES_PREDEFINIDOS = [
    {
        id: 'morosos',
        titulo: 'Top 10 Morosos',
        descripcion: 'Residentes con mayor deuda pendiente',
        emoji: '💸',
        color: 'from-red-500/20 to-red-900/10 border-red-500/30 hover:border-red-400/60',
        config: { baseEntity: 'CARGO', dimension: 'USUARIO.nombre', metricType: 'SUM', metricField: 'CARGO.monto', topN: '10', filtros: [{ field: 'CARGO.estado', operator: '=', value: 'Pendiente' }] }
    },
    {
        id: 'multas_residente',
        titulo: 'Residentes con Más Multas',
        descripcion: 'Quién acumula más llamados de atención',
        emoji: '🚨',
        color: 'from-orange-500/20 to-orange-900/10 border-orange-500/30 hover:border-orange-400/60',
        config: { baseEntity: 'LLAMADO_ATENCION', dimension: 'USUARIO.nombre', metricType: 'COUNT', metricField: 'LLAMADO_ATENCION.estado', topN: '10', filtros: [] }
    },
    {
        id: 'areas_populares',
        titulo: 'Áreas Sociales Más Populares',
        descripcion: 'Cuáles áreas se reservan más',
        emoji: '🏊',
        color: 'from-blue-500/20 to-blue-900/10 border-blue-500/30 hover:border-blue-400/60',
        config: { baseEntity: 'RESERVA', dimension: 'AREA_SOCIAL.nombre', metricType: 'COUNT', metricField: 'RESERVA.estado', topN: '0', filtros: [] }
    },
    {
        id: 'pagadores_top',
        titulo: 'Top Pagadores del Condominio',
        descripcion: 'Residentes que más han pagado en total',
        emoji: '🏆',
        color: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30 hover:border-emerald-400/60',
        config: { baseEntity: 'PAGO', dimension: 'USUARIO.nombre', metricType: 'SUM', metricField: 'PAGO.monto_total', topN: '10', filtros: [] }
    },
    {
        id: 'estado_pagos',
        titulo: 'Estado de Todos los Pagos',
        descripcion: 'Cuantos pagos hay por cada estado',
        emoji: '📊',
        color: 'from-violet-500/20 to-violet-900/10 border-violet-500/30 hover:border-violet-400/60',
        config: { baseEntity: 'PAGO', dimension: 'PAGO.estado', metricType: 'COUNT', metricField: 'PAGO.estado', topN: '0', filtros: [] }
    },
    {
        id: 'tipos_cargo',
        titulo: 'Cargos por Tipo',
        descripcion: 'Qué tipos de cargo se generan más',
        emoji: '🗂️',
        color: 'from-yellow-500/20 to-yellow-900/10 border-yellow-500/30 hover:border-yellow-400/60',
        config: { baseEntity: 'CARGO', dimension: 'TIPO_CARGO.nombre', metricType: 'COUNT', metricField: 'CARGO.estado', topN: '0', filtros: [] }
    },
    {
        id: 'motivos_multa',
        titulo: 'Motivos de Multa Más Comunes',
        descripcion: 'Por qué se sancionan más los residentes',
        emoji: '📋',
        color: 'from-red-500/20 to-pink-900/10 border-red-400/30 hover:border-pink-400/60',
        config: { baseEntity: 'LLAMADO_ATENCION', dimension: 'TIPO_CARGO.nombre', metricType: 'COUNT', metricField: 'LLAMADO_ATENCION.estado', topN: '0', filtros: [] }
    },
    {
        id: 'tickets_prioridad',
        titulo: 'Tickets por Prioridad',
        descripcion: 'Cuántos tickets abiertos hay por nivel de urgencia',
        emoji: '🔧',
        color: 'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30 hover:border-cyan-400/60',
        config: { baseEntity: 'TICKET', dimension: 'PRIORIDAD_TICKET.nombre', metricType: 'COUNT', metricField: 'TICKET.estado', topN: '0', filtros: [] }
    },
    {
        id: 'reservadores_top',
        titulo: 'Residentes que Más Reservan',
        descripcion: 'Quién usa más las áreas comunes',
        emoji: '🌟',
        color: 'from-indigo-500/20 to-indigo-900/10 border-indigo-500/30 hover:border-indigo-400/60',
        config: { baseEntity: 'RESERVA', dimension: 'USUARIO.nombre', metricType: 'COUNT', metricField: 'RESERVA.estado', topN: '10', filtros: [] }
    },
    {
        id: 'tipo_visita',
        titulo: 'Tipos de Visita Registrados',
        descripcion: 'Qué tipo de visitantes ingresan más',
        emoji: '🚶',
        color: 'from-teal-500/20 to-teal-900/10 border-teal-500/30 hover:border-teal-400/60',
        config: { baseEntity: 'INVITACION', dimension: 'TIPO_INVITACION.nombre', metricType: 'COUNT', metricField: 'INVITACION.estado', topN: '0', filtros: [] }
    },
];

export function ConfiguradorReporte() {
    const [cargando, setCargando]     = useState(false);
    const [datos, setDatos]           = useState([]);

    const [baseEntity, setBaseEntity]   = useState('PAGO');
    const [dimension, setDimension]     = useState('USUARIO.nombre');
    const [metricField, setMetricField] = useState('PAGO.monto_total');
    const [metricType, setMetricType]   = useState('SUM');
    const [topN, setTopN]               = useState('0');
    const [filtros, setFiltros]         = useState([]);

    const [nombreDimensionActual, setNombreDimensionActual] = useState('');
    const [nombreMetricaActual, setNombreMetricaActual]     = useState('');

    const [nuevoFiltro, setNuevoFiltro]     = useState({ field: '', operator: '=', value: '' });
    const [valoresFiltro, setValoresFiltro] = useState([]);
    const [cargandoValores, setCargandoValores] = useState(false);

    // Al cambiar el campo del filtro → cargar valores únicos desde BD
    useEffect(() => {
        if (!nuevoFiltro.field) { setValoresFiltro([]); return; }
        let cancelado = false;
        const fetchValores = async () => {
            setCargandoValores(true);
            try {
                const resp = await obtenerReporteDinamico(baseEntity, 300, {
                    baseEntity,
                    selections: [`${nuevoFiltro.field} AS label`],
                    aggregations: [],
                    groupBys: [nuevoFiltro.field],
                    filters: [],
                });
                if (!cancelado && resp.ok) {
                    const filas = normalizarClaves(resp.data);
                    setValoresFiltro(filas.map(r => r.label).filter(v => v !== null && v !== undefined));
                }
            } catch { /* silencioso */ }
            finally { if (!cancelado) setCargandoValores(false); }
        };
        fetchValores();
        return () => { cancelado = true; };
    }, [nuevoFiltro.field, baseEntity]);

    const agregarFiltro = () => {
        if (!nuevoFiltro.field || !nuevoFiltro.value) {
            toast.warning('Selecciona un campo y un valor para el filtro.');
            return;
        }
        setFiltros(prev => [...prev, nuevoFiltro]);
        setNuevoFiltro({ field: '', operator: '=', value: '' });
        setValoresFiltro([]);
    };

    const eliminarFiltro = (i) => setFiltros(prev => prev.filter((_, idx) => idx !== i));

    const generarReporte = async () => {
        if (!dimension || !metricField) {
            toast.error('Completa todos los campos de configuración.');
            return;
        }
        const etiquetaDim    = getNombreCampo(baseEntity, dimension);
        const etiquetaMetric = `${metricType === 'SUM' ? 'Suma' : metricType === 'COUNT' ? 'Conteo' : 'Promedio'} de ${metricType === 'COUNT' ? getNombreCampo(baseEntity, dimension) : getNombreCampo(baseEntity, metricField)}`;
        setNombreDimensionActual(etiquetaDim);
        setNombreMetricaActual(etiquetaMetric);

        setCargando(true);
        try {
            const payload = {
                baseEntity,
                selections: [`${dimension} AS label`],
                // COUNT usa COUNT(1) para no depender del tipo de columna métrica
                aggregations: [{
                    type: metricType,
                    field: metricType === 'COUNT' ? '1' : metricField,
                    alias: 'value'
                }],
                groupBys: [dimension],
                filters: filtros,
                limit: topN && topN !== '0' ? parseInt(topN, 10) : undefined,
            };
            const resp = await obtenerReporteDinamico(baseEntity, 100, payload);
            if (resp.ok) {
                // FIX: Oracle devuelve LABEL/VALUE en mayúsculas — normalizar a minúsculas
                setDatos(normalizarClaves(resp.data));
                if (resp.data.length === 0) toast.info('La consulta no arrojó resultados.');
            } else {
                toast.error(resp.mensaje || resp.message || 'Error al cargar los datos.');
            }
        } catch (err) {
            const msg = err.response?.data?.mensaje || err.response?.data?.message || err.message || 'Error de conexión.';
            console.error('Error reporte:', err.response?.data);
            toast.error(msg);
        } finally {
            setCargando(false);
        }
    };

    const datosExport = () => datos.map(r => ({
        [nombreDimensionActual || 'Categoría']: r.label,
        [nombreMetricaActual   || 'Valor']:     r.value,
    }));

    const handleExcel = () => {
        if (!datos.length) return toast.warning('No hay datos para exportar.');
        exportarAExcel(datosExport(), `Reporte_${baseEntity}`);
        toast.success('Excel generado.');
    };

    const handlePDF = () => {
        if (!datos.length) return toast.warning('No hay datos para exportar.');
        exportarAPDF(datosExport(), `Reporte_${baseEntity}`, `Reporte de ${TABLAS_TRANSACCIONALES.find(t => t.id === baseEntity)?.nombre}`);
        toast.success('PDF generado.');
    };

    const aplicarPlantilla = (plantilla) => {
        const { baseEntity: be, dimension: dim, metricType: mt, metricField: mf, topN: tn, filtros: fi } = plantilla.config;
        setBaseEntity(be);
        setDimension(dim);
        setMetricType(mt);
        setMetricField(mf);
        setTopN(tn);
        setFiltros(fi);
        setDatos([]);
        setNuevoFiltro({ field: '', operator: '=', value: '' });
        setValoresFiltro([]);
        toast.success(`Plantilla “${plantilla.titulo}” aplicada. Pulsa Generar Reporte.`);
    };

    return (
        <div className="flex flex-col gap-6">

            {/* ── Reportes Rápidos ── */}
            <div>
                <h3 className="text-sm font-semibold text-secundario uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primario" /> Reportes Rápidos — Un clic para aplicar
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {REPORTES_PREDEFINIDOS.map(r => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => aplicarPlantilla(r)}
                            className={`bg-gradient-to-br ${r.color} border rounded-xl p-3 text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-lg group`}
                        >
                            <div className="text-2xl mb-2">{r.emoji}</div>
                            <p className="text-xs font-bold text-primario leading-tight mb-1">{r.titulo}</p>
                            <p className="text-xs text-secundario leading-tight">{r.descripcion}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Configurador + Resultados ── */}
            <div className="flex flex-col lg:flex-row gap-6">

            {/* ── SIDEBAR ── */}
            <div className="w-full lg:w-1/3 flex flex-col gap-5">

                {/* Configuración */}
                <div className="bg-tarjeta/50 border border-borde rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold text-primario mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" /> Configurar Reporte
                    </h3>
                    <div className="space-y-4">

                        <Campo etiqueta="¿Qué datos quieres analizar?">
                            <Selector value={baseEntity} onChange={e => {
                                const t = e.target.value;
                                setBaseEntity(t);
                                setDimension(CAMPOS_DISPONIBLES[t][0].id);
                                
                                if (CAMPOS_METRICA[t].length > 0) {
                                    setMetricType('SUM');
                                    setMetricField(CAMPOS_METRICA[t][0].id);
                                } else {
                                    setMetricType('COUNT');
                                    setMetricField(CAMPOS_DISPONIBLES[t][0].id); // el valor no importa con COUNT(1) pero lo seteamos
                                }
                                
                                setDatos([]);
                                setFiltros([]);
                            }}>
                                {TABLAS_TRANSACCIONALES.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                            </Selector>
                        </Campo>

                        {/* Tip cross-table */}
                        <div className="flex gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 text-xs text-blue-300">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>Los campos ya incluyen datos de tablas relacionadas. Por ejemplo, selecciona <strong>"Residente"</strong> para cruzar con el nombre del usuario.</span>
                        </div>

                        <div className="pt-3 border-t border-borde grid grid-cols-2 gap-3">
                            <div>
                                <Campo etiqueta="Agrupar resultados por">
                                    <Selector value={dimension} onChange={e => setDimension(e.target.value)}>
                                        {CAMPOS_DISPONIBLES[baseEntity].map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </Selector>
                                    <p className="text-xs text-secundario mt-1">Eje horizontal del gráfico</p>
                                </Campo>
                            </div>
                            <div>
                                <Campo etiqueta="Mostrar primeros N">
                                    <Entrada
                                        type="number" min="0" step="1" placeholder="0 = todos"
                                        value={topN}
                                        onChange={e => setTopN(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <p className="text-xs text-secundario mt-1">0 para ver todos</p>
                                </Campo>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-borde">
                            <p className="text-xs text-secundario font-semibold uppercase tracking-wider mb-2">¿Qué valor calcular?</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                    <Campo etiqueta="Operación">
                                        <Selector value={metricType} onChange={e => {
                                            const t = e.target.value;
                                            setMetricType(t);
                                            // Si cambia a SUM/AVG y no hay campos numéricos, no hace nada
                                            if (t !== 'COUNT' && CAMPOS_METRICA[baseEntity].length > 0) {
                                                setMetricField(CAMPOS_METRICA[baseEntity][0].id);
                                            }
                                        }}>
                                            <option value="COUNT">Conteo (# de registros)</option>
                                            <option value="SUM" disabled={CAMPOS_METRICA[baseEntity].length === 0}>Suma (requiere campo numérico)</option>
                                            <option value="AVG" disabled={CAMPOS_METRICA[baseEntity].length === 0}>Promedio (requiere campo numérico)</option>
                                        </Selector>
                                    </Campo>
                                </div>
                                <div className="col-span-2">
                                    <Campo etiqueta={metricType === 'COUNT' ? 'Campo a contar' : 'Campo numérico'}>
                                        {metricType === 'COUNT' ? (
                                            <div className="p-2 rounded border border-borde text-xs text-secundario bg-fondo">
                                                Conteo automático de registros agrupados
                                            </div>
                                        ) : CAMPOS_METRICA[baseEntity].length > 0 ? (
                                            <Selector value={metricField} onChange={e => setMetricField(e.target.value)}>
                                                {CAMPOS_METRICA[baseEntity].map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                            </Selector>
                                        ) : (
                                            <div className="p-2 rounded border border-borde text-xs text-amber-400 bg-fondo">
                                                Sin campos numéricos — usa Conteo
                                            </div>
                                        )}
                                    </Campo>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-tarjeta/50 border border-borde rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-bold text-primario flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Filtros
                        </h3>
                        {filtros.length > 0 && (
                            <span className="text-xs bg-primario/20 text-primario rounded-full px-2 py-0.5 font-semibold">
                                {filtros.length} activo{filtros.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {filtros.length > 0 ? (
                        <div className="space-y-2 mb-4">
                            {filtros.map((f, i) => (
                                <div key={i} className="flex items-center justify-between bg-primario/10 border border-primario/30 p-2 rounded-lg">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-semibold text-primario truncate">{getNombreCampo(baseEntity, f.field)}</span>
                                        <span className="text-xs text-secundario">{f.operator} <strong className="text-white">{f.value}</strong></span>
                                    </div>
                                    <button type="button" onClick={() => eliminarFiltro(i)} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0 ml-2">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-secundario mb-4 italic">Sin filtros. Se incluyen todos los registros.</p>
                    )}

                    <div className="border-t border-borde pt-3 space-y-2">
                        <p className="text-xs text-secundario font-semibold uppercase tracking-wider">Agregar filtro</p>
                        <div className="grid grid-cols-2 gap-2">
                            <Campo etiqueta="Campo">
                                <Selector value={nuevoFiltro.field} onChange={e => setNuevoFiltro({ ...nuevoFiltro, field: e.target.value, value: '' })}>
                                    <option value="">Selecciona...</option>
                                    {CAMPOS_DISPONIBLES[baseEntity].map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </Selector>
                            </Campo>
                            <Campo etiqueta="Condición">
                                <Selector value={nuevoFiltro.operator} onChange={e => setNuevoFiltro({ ...nuevoFiltro, operator: e.target.value })}>
                                    <option value="=">Es igual a</option>
                                    <option value=">=">Mayor o igual</option>
                                    <option value="<=">Menor o igual</option>
                                    <option value="LIKE">Contiene</option>
                                </Selector>
                            </Campo>
                        </div>
                        <Campo etiqueta={nuevoFiltro.field ? `Valor de "${getNombreCampo(baseEntity, nuevoFiltro.field)}"` : 'Valor'}>
                            {cargandoValores ? (
                                <div className="flex items-center gap-2 p-2 rounded border border-borde text-xs text-secundario">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Cargando opciones...
                                </div>
                            ) : valoresFiltro.length > 0 ? (
                                <Selector value={nuevoFiltro.value} onChange={e => setNuevoFiltro({ ...nuevoFiltro, value: e.target.value })}>
                                    <option value="">Selecciona un valor...</option>
                                    {valoresFiltro.map((v, i) => <option key={i} value={v}>{v}</option>)}
                                </Selector>
                            ) : (
                                <Entrada
                                    placeholder={nuevoFiltro.field ? 'Escribe el valor...' : 'Primero selecciona un campo'}
                                    disabled={!nuevoFiltro.field}
                                    value={nuevoFiltro.value}
                                    onChange={e => setNuevoFiltro({ ...nuevoFiltro, value: e.target.value })}
                                />
                            )}
                        </Campo>
                        <button
                            type="button"
                            onClick={agregarFiltro}
                            disabled={!nuevoFiltro.field || !nuevoFiltro.value}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primario/20 text-primario border border-primario/40 text-sm font-semibold hover:bg-primario/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" /> Añadir Filtro
                        </button>
                    </div>
                </div>

                <BtnPrimario onClick={generarReporte} disabled={cargando}>
                    <Play className="w-4 h-4" /> {cargando ? 'Generando...' : 'Generar Reporte'}
                </BtnPrimario>
            </div>

            {/* ── ÁREA PRINCIPAL ── */}
            <div className="w-full lg:w-2/3 flex flex-col gap-5">

                <div className="flex justify-between items-center bg-tarjeta/50 border border-borde rounded-xl p-4 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-primario">Resultados</h2>
                        {datos.length > 0 && (
                            <p className="text-xs text-secundario mt-0.5">
                                {datos.length} registro{datos.length !== 1 ? 's' : ''}
                                {nombreDimensionActual && ` · Agrupado por: ${nombreDimensionActual}`}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <BtnPrimario onClick={handleExcel}><Download className="w-4 h-4" /> Excel</BtnPrimario>
                        <BtnPrimario onClick={handlePDF}><FileText className="w-4 h-4" /> PDF</BtnPrimario>
                    </div>
                </div>

                <div className="bg-fondo border border-borde rounded-xl p-6 shadow-sm min-h-[300px]">
                    {cargando ? (
                        <div className="w-full h-80 flex flex-col items-center justify-center text-secundario gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primario" />
                            <span className="text-sm">Consultando la base de datos...</span>
                        </div>
                    ) : datos.length > 0 ? (
                        <div className="space-y-8">
                            {/* TABLA PRIMERO */}
                            <div>
                                <h4 className="text-sm font-semibold text-secundario uppercase tracking-wider mb-3">Tabla de Datos</h4>
                                <div className="overflow-x-auto rounded-lg border border-borde">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-borde bg-tarjeta/50">
                                                <th className="p-3 text-secundario font-semibold">{nombreDimensionActual || 'Categoría'}</th>
                                                <th className="p-3 text-secundario font-semibold text-right">{nombreMetricaActual || 'Valor'}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datos.map((row, i) => (
                                                <tr key={i} className="border-b border-borde/50 hover:bg-zinc-800/20 transition-colors">
                                                    <td className="p-3 text-primario">{row.label}</td>
                                                    <td className="p-3 text-primario text-right font-mono">
                                                        {Number(row.value).toLocaleString('es-GT', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* GRÁFICA ABAJO */}
                            <div>
                                <h4 className="text-sm font-semibold text-secundario uppercase tracking-wider mb-3">Gráfica de Barras</h4>
                                <ReportWidget
                                    data={datos}
                                    colorPrimario="#00ffb3"
                                    nombreDimension={nombreDimensionActual}
                                    nombreMetrica={nombreMetricaActual}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-80 flex flex-col items-center justify-center text-secundario border border-dashed border-borde rounded-lg gap-3">
                            <BarChart3 className="w-10 h-10 opacity-30" />
                            <p className="text-sm text-center">
                                Configura el reporte y presiona <strong className="text-primario">Generar Reporte</strong>
                            </p>
                            <p className="text-xs text-secundario/60">Ejemplo: "Conteo de Llamados agrupado por Residente infractor"</p>
                        </div>
                    )}
                </div>
            </div>

            </div>{/* fin flex Configurador+Resultados */}

        </div>
    );
}
