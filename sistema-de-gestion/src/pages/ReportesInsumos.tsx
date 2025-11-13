import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, } from "recharts";
import { Card } from "./ReportesOrdenes"; // misma Card que ya usas
import { ResumenCardDark } from "./ReportesOrdenes"; // la del dashboard anterior
import { useContext } from "react";
import { InsumoContext } from "../Context/InsumoContext";
import { Movimiento_insumo_context } from "../Context/Movimiento_insumo_context";
import "../styles/reportesInsumos.css"

// Colores usados en todos los gráficos
const COLORS = ["#2ecc71", "#f1c40f", "#e74c3c", "#3498db", "#9b59b6"];

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
            acc[mov.responsable] = (acc[mov.responsable] || 0) + 1;
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

    // 🔹 5. Tipos de movimiento
    const movPorTipo = Object.entries(
        movimiento_insumos.reduce((acc: any, mov) => {
            acc[mov.tipo] = (acc[mov.tipo] || 0) + 1;
            return acc;
        }, {})
    ).map(([tipo, cantidad]) => ({ tipo, cantidad }));


    // === Componente principal ===
return (
    <div className="insumos-dashboard">

        {/* ==== RESUMEN SUPERIOR ==== */}
        <div className="resumen-container">
            <ResumenCardDark titulo="Total de Insumos" valor={totalInsumos} color="#3498db" />
            <ResumenCardDark titulo="Por debajo del umbral" valor={bajoUmbral} color="#e74c3c" />
            <ResumenCardDark titulo="Stock Total" valor={stockTotal} color="#2ecc71" />
        </div>

        {/* ==== GRID DE GRAFICOS ==== */}
        <div className="graficos-grid">

            <Card titulo="Stock por Categoría">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stockPorCategoria}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="categoria" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="stock" fill="#2ecc71" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Stock por Marca">
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

            <Card titulo="Distribución de Categorías (%)">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={stockPorCategoria} dataKey="stock" outerRadius={70} label>
                            {stockPorCategoria.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Stock vs Umbral Mínimo">
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={stockVsUmbral}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="nombre" stroke="#ccc" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Legend />
                        <Line type="monotone" dataKey="stock" stroke="#2ecc71" strokeWidth={2} name="Stock actual" />
                        <Line type="monotone" dataKey="umbral" stroke="#e74c3c" strokeWidth={2} name="Umbral mínimo" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* GRAFICOS DE MOVIMIENTOS */}

            <Card titulo="Ingresos por Mes">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ingresosPorMes}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="mes" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="cantidad" fill="#3498db" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Ingresos por Proveedor">
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

            <Card titulo="Ingresos por Responsable">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ingresosPorResponsable}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="responsable" stroke="#ccc" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#ccc" />
                        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                        <Bar dataKey="cantidad" fill="#e67e22" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Stock por Categoría (Ingresado)">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={stockPorCategoriaInsumo} dataKey="stock" outerRadius={90} label>
                            {stockPorCategoriaInsumo.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            <Card titulo="Tipos de Movimiento">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie dataKey="cantidad" data={movPorTipo} outerRadius={90} label>
                            {movPorTipo.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </Card>

        </div>
    </div>
);

}


export default ReportesInsumos;