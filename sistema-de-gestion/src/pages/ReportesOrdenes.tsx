import { useContext, useMemo } from "react";
import { OrdenesContext } from "../Context/OrdenesContext";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

const COLORS = ["#15a017ff", "#f4b400", "#f44336", "#2196f3"];

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
            if (o.estado === "CANCELADA" || o.estado === "EVALUACIÓN") agrupado[mes].errores += 1;
        });

        return Object.values(agrupado);
    }, [ordenes]);

    const resumenEstados = useMemo(() => {
        const total = ordenes.length;
        const enProduccion = ordenes.filter(o => o.estado === "EN_PRODUCCION").length;
        const finalizadas = ordenes.filter(o => o.estado === "FINALIZADA_ENTREGADA").length;
        const canceladas = ordenes.filter(o => o.estado === "CANCELADA").length;
        const evaluacion = ordenes.filter(o => o.estado === "EVALUACIÓN").length;

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

    const totalCanceladas = ordenes.filter(o => o.estado === "CANCELADA").length;
    const totalProduccion = ordenes.filter(o => o.estado === "EN_PRODUCCION").length;
    const totalFinalizadas = ordenes.filter(o => o.estado === "FINALIZADA_ENTREGADA").length;

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "30px 20px",
                color: "#fff",
                // background: "#121212",
                boxSizing: "border-box",
            }}
        >
            {/* --- Resumen superior --- */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                    background: "#1a1a1a",
                    padding: "20px",
                    borderRadius: "12px",
                }}
            >
                <ResumenCardDark titulo="En Producción" valor={totalProduccion} color="#f4b400" />
                <ResumenCardDark titulo="Canceladas" valor={totalCanceladas} color="#f44336" />
                <ResumenCardDark titulo="Finalizadas" valor={totalFinalizadas} color="#15a017ff" />
            </div>

            {/* --- Contenedor de gráficos --- */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "25px",
                    marginTop: "30px",
                }}
            >
                <Card titulo="Producción Mensual">
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={produccionMensual1}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="mes" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222" }} />
                            <Legend />
                            <Line type="monotone" dataKey="produccion" stroke="#15a017" strokeWidth={2} />
                            <Line type="monotone" dataKey="errores" stroke="#f44336" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Órdenes por Estado">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={resumenEstados.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222" }} />
                            <Bar dataKey="value">
                                <Cell fill="#15a017" />
                                <Cell fill="#f4b400" />
                                <Cell fill="#f44336" />
                                <Cell fill="#2196f3" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Distribución de Estados (%)">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={resumenEstados.data}
                                dataKey="value"
                                outerRadius={80}
                                label
                            >
                                {resumenEstados.data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#222" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Producción por Producto">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={produccionPorProducto}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="producto" stroke="#ccc" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222" }} />
                            <Bar dataKey="cantidad" fill="#15a017" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Producción Mensual por Estado">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={produccionMensual}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="mes" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222" }} />
                            <Legend />
                            <Bar dataKey="CANCELADA" stackId="a" fill="#f44336" />
                            <Bar dataKey="EN_PRODUCCION" stackId="a" fill="#f4b400" />
                            <Bar dataKey="FINALIZADA_ENTREGADA" stackId="a" fill="#15a017" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card titulo="Producción por Marca">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={produccionPorMarca}
                                dataKey="cantidad"
                                nameKey="marca"
                                outerRadius={80}
                                label
                            >
                                {produccionPorMarca.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#222" }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

// --- Cards reutilizables ---
export const Card = ({ titulo, children }: any) => (
    <div
        style={{
            background: "#1e1e1e",
            borderRadius: 12,
            padding: "15px 20px",
            color: "#fff",
            boxShadow: "0 0 12px rgba(0,0,0,0.4)",
        }}
    >
        <h4 style={{ color: "#15a017", marginBottom: 10, fontSize: "1rem" }}>{titulo}</h4>
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
