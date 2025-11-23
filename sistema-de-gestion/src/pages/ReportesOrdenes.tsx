import { useContext, useMemo } from "react";
import { OrdenesContext, estados } from "../Context/OrdenesContext";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import ReportExport from "../components/estaticos/ReportExport";

const COLORS = ["#8c52ff", "#f1c40f", "#b13c7e", "#d88346ff", "#b062ceff"];

const ReportesOrdenes = () => {
    const { ordenes } = useContext(OrdenesContext)!;

    // === 📊 Producción por mes y estado ===
    const produccionMensual = useMemo(() => {
        const resumen: Record<string, any> = {};
        ordenes.forEach((o) => {
            const mes = new Date(o.fechaCreacion).toLocaleString("es-AR", {
                month: "short",
            });
            if (!resumen[mes]) {
                resumen[mes] = { mes, CANCELADA: 0, EN_PRODUCCION: 0, FINALIZADA_ENTREGADA: 0 };
            }
            resumen[mes][o.estado] += 1;
        });
        return Object.values(resumen);
    }, [ordenes]);

    const ordenesUltimos30Dias = useMemo(() => {
        const hoy = new Date();
        const hace30dias = new Date();
        hace30dias.setDate(hoy.getDate() - 30);

        const resumen: Record<string, number> = {};

        ordenes.forEach((o) => {
            const fecha = new Date(o.fechaCreacion);
            if (fecha >= hace30dias) {
                const dia = fecha.toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                });
                resumen[dia] = (resumen[dia] || 0) + 1;
            }
        });

        return Object.entries(resumen).map(([dia, cantidad]) => ({
            dia,
            cantidad,
        }));
    }, [ordenes]);


    const produccionPorMarca = useMemo(() => {
        const resumen: Record<string, number> = {};
        ordenes.forEach((o) => {
            resumen[o.marca] = (resumen[o.marca] || 0) + 1;
        });
        return Object.entries(resumen).map(([marca, cantidad]) => ({
            marca, cantidad
        }));
    }, [ordenes]);

    const produccionMensual1 = useMemo(() => {
        if (!ordenes || ordenes.length === 0) return [];
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const agrupado: Record<string, { mes: string; produccion: number; errores: number }> = {};
        meses.forEach((m) => (agrupado[m] = { mes: m, produccion: 0, errores: 0 }));

        ordenes.forEach((o) => {
            const fecha = new Date(o.fechaCreacion || o.fechaEntrega);
            const mes = meses[fecha.getMonth()];
            if (!mes) return;
            agrupado[mes].produccion += o.stockProducidoReal || 0;
            if (o.estado === estados.cancelada || o.estado === estados.evaluacion) agrupado[mes].errores += 1;
        });

        return Object.values(agrupado);
    }, [ordenes]);

    const resumenEstados = useMemo(() => {
        const total = ordenes.length;
        const enProduccion = ordenes.filter(o => o.estado === estados.enProduccion).length;
        const finalizadas = ordenes.filter(o => o.estado === estados.finalizada).length;
        const canceladas = ordenes.filter(o => o.estado === estados.cancelada).length;
        const evaluacion = ordenes.filter(o => o.estado === estados.evaluacion).length;

        return {
            total, enProduccion, finalizadas, canceladas,
            data: [
                { name: "Finalizadas", value: finalizadas },
                { name: "En Producción", value: enProduccion },
                { name: "Canceladas", value: canceladas },
                { name: "Evaluacion", value: evaluacion },
            ]
        };
    }, [ordenes]);

    const produccionPorProducto = useMemo(() => {
        const agrupado: Record<string, number> = {};
        ordenes.forEach((o) => {
            agrupado[o.productoRequerido] =
                (agrupado[o.productoRequerido] || 0) + o.stockProducidoReal;
        });
        return Object.entries(agrupado).map(([producto, cantidad]) => ({
            producto, cantidad
        }));
    }, [ordenes]);

    const totalCanceladas = ordenes.filter(o => o.estado === estados.cancelada).length;
    const totalProduccion = ordenes.filter(o => o.estado === estados.enProduccion).length;
    const totalFinalizadas = ordenes.filter(o => o.estado === estados.finalizada).length;

    return (
    <div className="insumos-dashboard">

        <ReportExport
            filename="Reporte_produccion"
            exportId="reporte-produccion"
            csvData={ordenes}
        />

        <div id="reporte-produccion">

            {/* ==== RESUMEN SUPERIOR ==== */}
            <div className="resumen-container">
                <ResumenCardDark titulo="En Producción" valor={totalProduccion} color="#8c52ff" />
                <ResumenCardDark titulo="Canceladas" valor={totalCanceladas} color="#b13c7e" />
                <ResumenCardDark titulo="Finalizadas" valor={totalFinalizadas} color="#d88346ff" />
            </div>

            {/* ===================================================================================
                BLOQUE PRINCIPAL ESTILO GULL
            =================================================================================== */}
            <div className="dashboard-main">

                {/* === GRÁFICO GRANDE === */}
                <div className="main-chart">
                    <Card titulo="Producción Mensual">
                        <ResponsiveContainer width="100%" height={330}>
                            <LineChart data={produccionMensual1}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="mes" stroke="#ccc" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#ccc" />
                                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                                <Legend />
                                <Line type="monotone" dataKey="produccion" stroke="#b13c7e" strokeWidth={2} />
                                <Line type="monotone" dataKey="errores" stroke="#d88346ff" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* === PIE CHARTS JUNTOS === */}
                <div className="pie-wrapper">
                    <Card titulo="Distribución de Estados (%)" className="pie-card">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={resumenEstados.data}
                                    dataKey="value"
                                    outerRadius={70}
                                    label
                                >
                                    {resumenEstados.data.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card titulo="Producción por Marca" className="pie-card">
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie
                                    data={produccionPorMarca}
                                    dataKey="cantidad"
                                    nameKey="marca"
                                    outerRadius={70}
                                    label
                                >
                                    {produccionPorMarca.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

            </div>

            {/* ===================================================================================
                RESTO DE GRÁFICOS ABAJO
            =================================================================================== */}
            <div className="graficos-grid">

                <Card titulo="Órdenes de los Últimos 30 Días" className="card-grafico">
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={ordenesUltimos30Dias}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="dia" stroke="#ccc" />
                            <YAxis stroke="#ccc" allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                            <Line type="monotone" dataKey="cantidad" stroke="#8c52ff" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Órdenes por Estado" className="card-grafico">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={resumenEstados.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                            <Bar dataKey="value">
                                <Cell fill="#8c52ff" />
                                <Cell fill="#d88346ff" />
                                <Cell fill="#b13c7e" />
                                <Cell fill="#f1c40f" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Producción por Producto" className="card-grafico">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={produccionPorProducto}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="producto" stroke="#ccc" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                            <Bar dataKey="cantidad" fill="#b13c7e" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Producción Mensual por Estado" className="card-grafico">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={produccionMensual}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="mes" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                            <Legend />
                            <Bar dataKey="CANCELADA" stackId="a" fill="#d88346ff" />
                            <Bar dataKey="EN_PRODUCCION" stackId="a" fill="#8c52ff" />
                            <Bar dataKey="FINALIZADA_ENTREGADA" stackId="a" fill="#b13c7e" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

            </div>
        </div>
    </div>
);
};

// --- Cards reutilizables ---
export const Card = ({ titulo, children }: any) => (
    <div
        style={{
            padding: "15px 20px",
            color: "#fff",
            background: "#0e1217"

        }}
    >
        <h4 style={{ color: "#b13c7e", marginBottom: 10, fontSize: "1rem" }}>{titulo}</h4>
        {children}
    </div>
);

export const ResumenCardDark = ({ titulo, valor, color }: any) => (
    <div
        style={{
            flex: 1,
            minWidth: 200,
            background: "#1e1e1e",
            borderRadius: 12,
            padding: "20px 25px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: `4px solid ${color}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}
    >
        <h4 style={{ margin: 0, color: "#ccc" }}>{titulo}</h4>
        <p style={{ marginTop: 8, fontSize: 28, fontWeight: "bold", color }}>{valor}</p>
    </div>
);

export default ReportesOrdenes;
