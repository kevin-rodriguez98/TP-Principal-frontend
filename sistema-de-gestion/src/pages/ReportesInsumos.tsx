import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, } from "recharts";
import { Card } from "./ReportesOrdenes"; // misma Card que ya usas
import { ResumenCardDark } from "./ReportesOrdenes"; // la del dashboard anterior
import { useContext } from "react";
import { InsumoContext } from "../Context/InsumoContext";
import { Movimiento_insumo_context } from "../Context/Movimiento_insumo_context";
import "../styles/reportesInsumos.css"
import ReportExport from "../components/estaticos/ReportExport";

// Colores usados en todos los gráficos
const COLORS = ["#8c52ff", "#f1c40f", "#b13c7e", "#d88346ff", "#b062ceff"];

const ReportesInsumos = () => {

    const { insumos } = useContext(InsumoContext)!;
    const { movimiento_insumos } = useContext(Movimiento_insumo_context)!;

    // === Datos derivados ===
    const totalInsumos = insumos.length;
    const stockTotal = insumos.reduce((acc, i) => acc + i.stock, 0);
    const bajoUmbral = insumos.filter(i => i.stock < i.umbralMinimoStock).length;

    const stockPorCategoria = Object.entries(
        insumos.reduce((acc: any, i) => {
            acc[i.categoria] = (acc[i.categoria] || 0) + i.stock;
            return acc;
        }, {})
    ).map(([categoria, stock]) => ({ categoria, stock }));

    const stockPorMarca = Object.entries(
        insumos.reduce((acc: any, i) => {
            acc[i.marca] = (acc[i.marca] || 0) + i.stock;
            return acc;
        }, {})
    ).map(([marca, stock]) => ({ marca, stock }));

    const stockVsUmbral = insumos.map(i => ({
        nombre: i.nombre,
        stock: i.stock,
        umbral: i.umbralMinimoStock,
    }));

    // === DATOS DERIVADOS ===

    // 🔹 1. Ingresos por mes
    const ingresosPorMes = Object.entries(
        movimiento_insumos.reduce((acc: any, mov) => {
            const mes = new Date(mov.id).toLocaleString("es-AR", { month: "short" });
            acc[mes] = (acc[mes] || 0) + 1;
            return acc;
        }, {})
    ).map(([mes, cantidad]) => ({ mes, cantidad }));

    // 🔹 2. Ingresos por proveedor
    const ingresosPorProveedor = Object.entries(
        movimiento_insumos.reduce((acc: any, mov) => {
            acc[mov.proveedor] = (acc[mov.proveedor] || 0) + 1;
            return acc;
        }, {})
    ).map(([proveedor, cantidad]) => ({ proveedor, cantidad }));

    // 🔹 3. Ingresos por responsable
    const ingresosPorResponsable = Object.entries(
        movimiento_insumos.reduce((acc: any, mov) => {
            acc[mov.legajo] = (acc[mov.legajo] || 0) + 1;
            return acc;
        }, {})
    ).map(([responsable, cantidad]) => ({ responsable, cantidad }));

    // 🔹 4. Stock ingresado por categoría
    const stockPorCategoriaInsumo = Object.entries(
        movimiento_insumos.reduce((acc: any, mov) => {
            acc[mov.categoria] = (acc[mov.categoria] || 0) + mov.stock;
            return acc;
        }, {})
    ).map(([categoria, stock]) => ({ categoria, stock }));

    


    // === Componente principal ===
    return (
<div className="insumos-dashboard">

    <ReportExport
        filename="Reporte_Insumos"
        exportId="reporte-insumos"
        csvData={insumos}
    />

    <div id="reporte-insumos">
         <div style={{textAlign: "center", padding: "20px", background: "#0e1217"}}>     <h2 style={{ margin: 0, color: "#5b088cff", fontSize: "30px"}}>Reporte de insumos</h2></div>
        {/* ==== RESUMEN SUPERIOR ==== */}
        <div className="resumen-container">
            <ResumenCardDark titulo="Total de Insumos" valor={totalInsumos} color="#8c52ff" />
            <ResumenCardDark titulo="Por debajo del umbral" valor={bajoUmbral} color="#d88346ff" />
            <ResumenCardDark titulo="Stock Total" valor={stockTotal} color="#b13c7e" />
        </div>

        {/* ===================================================================================
            BLOQUE PRINCIPAL ESTILO GULL 
        =================================================================================== */}
        <div className="dashboard-main">

            {/* === GRÁFICO GRANDE === */}
            <div className="main-chart">
                <Card titulo="Stock vs Umbral Mínimo">
                    <ResponsiveContainer width="100%" height={330}>
                        <LineChart data={stockVsUmbral}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="nombre" stroke="#ccc" tick={{ fontSize: 10 }} />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                            <Legend />
                            <Line type="monotone" dataKey="stock" stroke="#b13c7e" strokeWidth={2} name="Stock actual" />
                            <Line type="monotone" dataKey="umbral" stroke="#8c52ff" strokeWidth={2} name="Umbral mínimo" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* === DOS PIE CHARTS JUNTOS (UNO ARRIBA DEL OTRO) === */}
            <div className="pie-wrapper">

                <Card titulo="Distribución de Categorías (%)" className="pie-card">
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={stockPorCategoria} nameKey="categoria" dataKey="stock" outerRadius={70} label>
                                {stockPorCategoria.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

<Card titulo="Stock por Categoría (Ingresado)" className="pie-card">
    <ResponsiveContainer width="100%" height={220}>
        <BarChart
            layout="vertical"
            data={stockPorCategoriaInsumo}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" stroke="#ccc" />
            <YAxis type="category" dataKey="categoria" stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
            <Bar dataKey="stock" fill="#8c52ff">
                {stockPorCategoriaInsumo.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>
</Card>

            </div>
        </div>

        {/* ===================================================================================
            RESTO DE GRÁFICOS ABAJO 
        =================================================================================== */}
        <div className="graficos-grid">

            <Card titulo="Stock por Categoría" className="card-grafico">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stockPorCategoria}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="categoria" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="stock" fill="#d88346ff" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Stock por Marca" className="card-grafico">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stockPorMarca}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="marca" stroke="#ccc" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="stock" fill="#f1c40f" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Ingresos por Mes" className="card-grafico">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ingresosPorMes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="mes" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="cantidad" fill="#b13c7e" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Ingresos por Proveedor" className="card-grafico">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ingresosPorProveedor}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="proveedor" stroke="#ccc" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="cantidad" fill="#9b59b6" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Ingresos por Responsable" className="card-grafico">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ingresosPorResponsable}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="responsable" stroke="#ccc" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="cantidad" fill="#8c52ff" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

        </div>

    </div>
</div>
    );

}


export default ReportesInsumos;