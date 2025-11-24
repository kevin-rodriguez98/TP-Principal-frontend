import { useContext, useEffect, useState, useMemo } from "react";
import { OrdenesContext, estados } from "../Context/OrdenesContext";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import ReportExport from "../components/estaticos/ReportExport";

const COLORS = ["#8c52ff", "#f1c40f", "#b13c7e", "#d88346ff", "#b062ceff"];

const ReportesOrdenes = () => {
  const { ordenes, filtrarOrdenes } = useContext(OrdenesContext)!;

  // -------------------------------
  // FILTROS DEL USUARIO (solo UI)
  // -------------------------------
  const [fechaFiltro, setFechaFiltro] = useState<string>("");
  const [ultimosXDias, setUltimosXDias] = useState<number | "todos">(30);

  // -------------------------------
  // LLAMADO AL BACKEND
  // -------------------------------
  useEffect(() => {
    if (fechaFiltro) {
      filtrarOrdenes(fechaFiltro);
      return;
    }

    if (ultimosXDias !== "todos") {
      filtrarOrdenes(undefined, ultimosXDias);
      return;
    }

    filtrarOrdenes();
  }, [fechaFiltro, ultimosXDias]);

  // Los datos YA vienen filtrados
  const ordenesFiltradas = ordenes;

  // -------------------------------
  // GRÁFICO: Producción mensual
  // -------------------------------
  const produccionMensual = useMemo(() => {
    const resumen: Record<string, any> = {};

    ordenesFiltradas.forEach((o) => {
      const fecha = new Date(o.fechaCreacion);
      const clave = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = fecha.toLocaleString("es-AR", { month: "short" });

      if (!resumen[clave]) {
        resumen[clave] = {
          clave,
          mes: label,
          ...(Object.values(estados).reduce((acc, estado) => {
            acc[estado as string] = 0;
            return acc;
          }, {} as Record<string, number>)),
        };
      }

      resumen[clave][o.estado] += 1;
    });

    return Object.values(resumen).sort((a, b) =>
      a.clave.localeCompare(b.clave)
    );
  }, [ordenesFiltradas]);

  const produccionDiaria = useMemo(() => {
  const resumen: Record<string, any> = {};

  ordenesFiltradas.forEach((o) => {
    const fecha = new Date(o.fechaCreacion);
    const dia = fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
    });

    if (!resumen[dia]) {
      resumen[dia] = {
        dia,
        ...(Object.values(estados).reduce((acc, estado) => {
          acc[estado as string] = 0;
          return acc;
        }, {} as Record<string, number>)),
      };
    }

    resumen[dia][o.estado] += 1;
  });

  return Object.values(resumen);
}, [ordenesFiltradas]);

  // -------------------------------
  // GRÁFICO: Órdenes por día
  // -------------------------------
  const ordenesUltimosXDias = useMemo(() => {
    const resumen: Record<string, number> = {};

    ordenesFiltradas.forEach((o) => {
      const fecha = new Date(o.fechaCreacion);
      const dia = fecha.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
      });
      resumen[dia] = (resumen[dia] || 0) + 1;
    });

    return Object.entries(resumen).map(([dia, cantidad]) => ({
      dia,
      cantidad,
    }));
  }, [ordenesFiltradas]);

  // -------------------------------
  // GRÁFICO: Producción por marca
  // -------------------------------
  const produccionPorMarca = useMemo(() => {
    const resumen: Record<string, number> = {};
    ordenesFiltradas.forEach((o) => {
      resumen[o.marca] = (resumen[o.marca] || 0) + 1;
    });
    return Object.entries(resumen).map(([marca, cantidad]) => ({
      marca,
      cantidad,
    }));
  }, [ordenesFiltradas]);

const variosMeses = useMemo(() => {
  return produccionMensual.length > 1;
}, [produccionMensual]);
  // -------------------------------
  // GRÁFICO: Producción por producto
  // -------------------------------
  const produccionPorProducto = useMemo(() => {
    const resumen: Record<string, number> = {};
    ordenesFiltradas.forEach((o) => {
      resumen[o.productoRequerido] =
        (resumen[o.productoRequerido] || 0) + o.stockProducidoReal;
    });
    return Object.entries(resumen).map(([producto, cantidad]) => ({
      producto,
      cantidad,
    }));
  }, [ordenesFiltradas]);

  // -------------------------------
  // PIE: Estados
  // -------------------------------
  const resumenEstados = useMemo(() => {
    const total = ordenesFiltradas.length;

    const enProduccion = ordenesFiltradas.filter(
      (o) => o.estado === estados.enProduccion
    ).length;
    const finalizadas = ordenesFiltradas.filter(
      (o) => o.estado === estados.finalizada
    ).length;
    const canceladas = ordenesFiltradas.filter(
      (o) => o.estado === estados.cancelada
    ).length;
    const evaluacion = ordenesFiltradas.filter(
      (o) => o.estado === estados.evaluacion
    ).length;

    return {
      total,
      enProduccion,
      finalizadas,
      canceladas,
      evaluacion,
      data: [
        { name: "Finalizadas", value: finalizadas },
        { name: "En Producción", value: enProduccion },
        { name: "Canceladas", value: canceladas },
        { name: "Evaluación", value: evaluacion },
      ],
    };
  }, [ordenesFiltradas]);

  return (
    <div className="insumos-dashboard">

      {/* EXPORT */}
      <ReportExport
        filename="Reporte_produccion"
        exportId="reporte-produccion"
        csvData={ordenes}
      />

      {/* ---------------------------------- */}
      {/*            FILTROS                 */}
      {/* ---------------------------------- */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => {
            setFechaFiltro(e.target.value);
            setUltimosXDias("todos");
          }}
        />

        <select
          value={ultimosXDias}
          onChange={(e) => {
            const val = e.target.value;
            setUltimosXDias(val === "todos" ? "todos" : Number(val));
            setFechaFiltro("");
          }}
        >
          <option value="todos">Todos</option>
          <option value={7}>Últimos 7 días</option>
          <option value={15}>Últimos 15 días</option>
          <option value={30}>Últimos 30 días</option>
        </select>
      </div>

      {/* ---------------------------------- */}
      {/*             RESUMEN                */}
      {/* ---------------------------------- */}
      <div className="resumen-container">
        <ResumenCardDark
          titulo="En Producción"
          valor={resumenEstados.enProduccion}
          color="#8c52ff"
        />
        <ResumenCardDark
          titulo="Canceladas"
          valor={resumenEstados.canceladas}
          color="#b13c7e"
        />
        <ResumenCardDark
          titulo="Finalizadas"
          valor={resumenEstados.finalizadas}
          color="#d88346ff"
        />
        <ResumenCardDark
          titulo="Evaluación"
          valor={resumenEstados.evaluacion}
          color="#f1c40f"
        />
      </div>

      {/* ---------------------------------- */}
      {/*          GRÁFICOS PRINCIPALES      */}
      {/* ---------------------------------- */}
      <div className="dashboard-main">

       {variosMeses && (
    <Card titulo="Producción Mensual">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={produccionMensual}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey={estados.enProduccion} stroke="#82ca9d" />
          <Line type="monotone" dataKey={estados.cancelada} stroke="#ff0000" />
          <Line type="monotone" dataKey={estados.finalizada} stroke="#0088fe" />
          <Line type="monotone" dataKey={estados.evaluacion} stroke="#aa00ff" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )}

 {/* 2️⃣ SI SOLO HAY 1 MES → DIARIO POR ESTADOS */}
{!variosMeses && (
  <Card titulo="Producción Diaria">
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={produccionDiaria}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dia" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />

        {/* MISMOS ESTADOS Y MISMOS COLORES QUE EL MENSUAL */}
        <Line
          type="monotone"
          dataKey={estados.enProduccion}
          stroke="#82ca9d"
          name="En Producción"
        />
        <Line
          type="monotone"
          dataKey={estados.cancelada}
          stroke="#ff0000"
          name="Cancelada"
        />
        <Line
          type="monotone"
          dataKey={estados.finalizada}
          stroke="#0088fe"
          name="Finalizada"
        />
        <Line
          type="monotone"
          dataKey={estados.evaluacion}
          stroke="#aa00ff"
          name="Evaluación"
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
)}

        {/* PIE: ESTADOS */}
        <div className="pie-wrapper">
          <Card titulo="Distribución de Estados (%)">
            <ResponsiveContainer width="100%" height={180}>
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* POR MARCA */}
          <Card titulo="Producción por Marca">
            <ResponsiveContainer width="100%" height={180}>
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/*          GRÁFICOS SECUNDARIOS      */}
      {/* ---------------------------------- */}
      <div className="graficos-grid">

        {/* ORDENES POR DÍA */}
        <Card titulo="Órdenes por Día">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ordenesUltimosXDias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#8c52ff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* PRODUCCIÓN POR PRODUCTO */}
        <Card titulo="Producción por Producto">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={produccionPorProducto}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="producto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#b13c7e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

// ===== Componentes auxiliares =====

export const Card = ({ titulo, children }: any) => (
  <div
    style={{
      padding: "15px 20px",
      background: "#0e1217",
      marginBottom: 20,
    }}
  >
    <h4 style={{ color: "#b13c7e" }}>{titulo}</h4>
    {children}
  </div>
);

export const ResumenCardDark = ({ titulo, valor, color }: any) => (
  <div
    style={{
      flex: 1,
      minWidth: 200,
      background: "#0e1217",
      borderRadius: 12,
      padding: "20px 25px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderTop: `4px solid ${color}`,
      marginBottom: 20,
    }}
  >
    <h4 style={{ color: "#ccc" }}>{titulo}</h4>
    <p style={{ fontSize: 28, fontWeight: "bold", color }}>{valor}</p>
  </div>
);

export default ReportesOrdenes;
