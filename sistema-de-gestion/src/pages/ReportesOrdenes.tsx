import { useContext, useMemo, useState } from "react";
import { OrdenesContext, estados } from "../Context/OrdenesContext";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import ReportExport from "../components/estaticos/ReportExport";

const COLORS = ["#8c52ff", "#f1c40f", "#b13c7e", "#d88346ff", "#b062ceff"];

const ReportesOrdenes = () => {
  const { ordenes } = useContext(OrdenesContext)!;

  // 🔹 Estados para filtros
  const [fechaFiltro, setFechaFiltro] = useState<string>("");
  const [ultimosXDias, setUltimosXDias] = useState<number | "todos">(30);

  // 🔹 Ordenes filtradas para gráficos
  const ordenesFiltradas = useMemo(() => {
    if (fechaFiltro) {
      return ordenes.filter(
        (o) => new Date(o.fechaCreacion).toISOString().slice(0, 10) === fechaFiltro
      );
    } else if (ultimosXDias !== "todos") {
      const desde = new Date();
      desde.setDate(desde.getDate() - (ultimosXDias as number));
      return ordenes.filter((o) => new Date(o.fechaCreacion) >= desde);
    } else {
      return ordenes; // Todos
    }
  }, [ordenes, fechaFiltro, ultimosXDias]);

  // ==============================
  // 📊 Datos para gráficos
  // ==============================
  const produccionMensual = useMemo(() => {
    const resumen: Record<string, any> = {};
    ordenesFiltradas.forEach((o) => {
      const mes = new Date(o.fechaCreacion).toLocaleString("es-AR", { month: "short" });
      if (!resumen[mes]) {
        resumen[mes] = { mes, CANCELADA: 0, EN_PRODUCCION: 0, FINALIZADA_ENTREGADA: 0 };
      }
      resumen[mes][o.estado] += 1;
    });
    return Object.values(resumen);
  }, [ordenesFiltradas]);

  const ordenesUltimosXDias = useMemo(() => {
    const resumen: Record<string, number> = {};
    ordenesFiltradas.forEach((o) => {
      const fecha = new Date(o.fechaCreacion);
      const dia = fecha.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
      resumen[dia] = (resumen[dia] || 0) + 1;
    });
    return Object.entries(resumen).map(([dia, cantidad]) => ({ dia, cantidad }));
  }, [ordenesFiltradas]);

  const produccionPorMarca = useMemo(() => {
    const resumen: Record<string, number> = {};
    ordenesFiltradas.forEach((o) => { resumen[o.marca] = (resumen[o.marca] || 0) + 1; });
    return Object.entries(resumen).map(([marca, cantidad]) => ({ marca, cantidad }));
  }, [ordenesFiltradas]);

  const produccionPorProducto = useMemo(() => {
    const resumen: Record<string, number> = {};
    ordenesFiltradas.forEach((o) => { resumen[o.productoRequerido] = (resumen[o.productoRequerido] || 0) + o.stockProducidoReal; });
    return Object.entries(resumen).map(([producto, cantidad]) => ({ producto, cantidad }));
  }, [ordenesFiltradas]);

  const resumenEstados = useMemo(() => {
    const total = ordenesFiltradas.length;
    const enProduccion = ordenesFiltradas.filter(o => o.estado === estados.enProduccion).length;
    const finalizadas = ordenesFiltradas.filter(o => o.estado === estados.finalizada).length;
    const canceladas = ordenesFiltradas.filter(o => o.estado === estados.cancelada).length;
    const evaluacion = ordenesFiltradas.filter(o => o.estado === estados.evaluacion).length;
    return {
      total, enProduccion, finalizadas, canceladas,
      data: [
        { name: "Finalizadas", value: finalizadas },
        { name: "En Producción", value: enProduccion },
        { name: "Canceladas", value: canceladas },
        { name: "Evaluacion", value: evaluacion },
      ]
    };
  }, [ordenesFiltradas]);

  const totalCanceladas = resumenEstados.canceladas;
  const totalProduccion = resumenEstados.enProduccion;
  const totalFinalizadas = resumenEstados.finalizadas;

  return (
    <div className="insumos-dashboard">

      <ReportExport filename="Reporte_produccion" exportId="reporte-produccion" csvData={ordenes} />

      {/* ==== FILTROS ==== */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => { setFechaFiltro(e.target.value); setUltimosXDias("todos"); }}
          style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select
          value={ultimosXDias}
          onChange={(e) => {
            const val = e.target.value;
            setUltimosXDias(val === "todos" ? "todos" : Number(val));
            setFechaFiltro("");
          }}
          style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="todos">Todos</option>
          <option value={7}>Últimos 7 días</option>
          <option value={15}>Últimos 15 días</option>
          <option value={30}>Últimos 30 días</option>
        </select>
      </div>

      {/* ==== RESUMEN ==== */}
      <div className="resumen-container">
        <ResumenCardDark titulo="En Producción" valor={totalProduccion} color="#8c52ff" />
        <ResumenCardDark titulo="Canceladas" valor={totalCanceladas} color="#b13c7e" />
        <ResumenCardDark titulo="Finalizadas" valor={totalFinalizadas} color="#d88346ff" />
      </div>

      {/* ==== GRÁFICOS ==== */}
      <div className="dashboard-main">
        <Card titulo="Producción Mensual">
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={produccionMensual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="mes" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="CANCELADA" stroke="#d88346ff" strokeWidth={2} />
              <Line type="monotone" dataKey="EN_PRODUCCION" stroke="#8c52ff" strokeWidth={2} />
              <Line type="monotone" dataKey="FINALIZADA_ENTREGADA" stroke="#b13c7e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="pie-wrapper">
          <Card titulo="Distribución de Estados (%)">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={resumenEstados.data} dataKey="value" outerRadius={70} label>
                  {resumenEstados.data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card titulo="Producción por Marca">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={produccionPorMarca} dataKey="cantidad" nameKey="marca" outerRadius={70} label>
                  {produccionPorMarca.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* ==== GRÁFICOS SECUNDARIOS ==== */}
      <div className="graficos-grid">
        <Card titulo="Órdenes por Día">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ordenesUltimosXDias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="dia" stroke="#ccc" />
              <YAxis stroke="#ccc" allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Line type="monotone" dataKey="cantidad" stroke="#8c52ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card titulo="Producción por Producto">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={produccionPorProducto}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="producto" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
              <Bar dataKey="cantidad" fill="#b13c7e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

// --- Cards reutilizables ---
export const Card = ({ titulo, children }: any) => (
  <div style={{ padding: "15px 20px", color: "#fff", background: "#0e1217", marginBottom: 20 }}>
    <h4 style={{ color: "#b13c7e", marginBottom: 10 }}>{titulo}</h4>
    {children}
  </div>
);

export const ResumenCardDark = ({ titulo, valor, color }: any) => (
  <div style={{
    flex: 1, minWidth: 200, background: "#1e1e1e", borderRadius: 12,
    padding: "20px 25px", display: "flex", flexDirection: "column",
    alignItems: "center", borderTop: `4px solid ${color}`,
    boxShadow: "0 2px 6px rgba(0,0,0,0.4)`, marginBottom: 20"
  }}>
    <h4 style={{ margin: 0, color: "#ccc" }}>{titulo}</h4>
    <p style={{ marginTop: 8, fontSize: 28, fontWeight: "bold", color }}>{valor}</p>
  </div>
);

export default ReportesOrdenes;