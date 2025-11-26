import { useContext, useEffect, useState, useMemo } from "react";
import { OrdenesContext, estados, type OrdenProduccion } from "../Context/OrdenesContext";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import ReportExport from "../components/estaticos/ReportExport";

const COLORS = ["#b062ceff", "#8c52ff","#b13c7e", "#d88346ff",  "#f1c40f"];

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
const produccionPorEtapa = useMemo(() => {
  const resumen: Record<string, number> = {};

  ordenesFiltradas.forEach((o) => {
    const etapa = o.etapa ?? "Sin Etapa";
    resumen[etapa] = (resumen[etapa] || 0) + 1; // cuenta órdenes por etapa
  });

  return Object.entries(resumen).map(([etapa, cantidad]) => ({
    etapa,
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


const desperdicioPorFecha = useMemo(() => {
  const finalizadas = ordenesFiltradas.filter(
    (o: OrdenProduccion) => o.estado === estados.finalizada
  );

  const resultado: Record<
    string,
    { fecha: string; produccion: number; desperdicio: number }
  > = {};

  finalizadas.forEach((o) => {
    const fecha = new Date(o.fechaCreacion).toLocaleDateString("es-AR");

    if (!resultado[fecha]) {
      resultado[fecha] = {
        fecha,
        produccion: 0,
        desperdicio: 0,
      };
    }

    const planificada = o.stockRequerido ?? 0;
    const real = o.stockProducidoReal ?? 0;

    let desperdicio = planificada - real;
    if (desperdicio < 0) desperdicio = 0;

    resultado[fecha].produccion += real;
    resultado[fecha].desperdicio += desperdicio;
  });

  return Object.values(resultado);
}, [ordenesFiltradas]);

const produccionYDesperdicioPorProducto = ordenes.reduce((acc, o) => {
  const producto = o.productoRequerido;

  const producido = o.stockProducidoReal;
  const desperdicio = Math.max(o.stockRequerido - o.stockProducidoReal, 0);

  if (!acc[producto]) {
    acc[producto] = { 
      producto,
      producido: 0,
      desperdiciado: 0 
    };
  }

  acc[producto].producido += producido;
  acc[producto].desperdiciado += desperdicio;

  return acc;
}, {} as any);

const desperdicioPorProductoArray = Object.values(produccionYDesperdicioPorProducto);

const desperdicioMensual = useMemo(() => {
  // Aplica SOLO cuando el usuario selecciona "todos"
  if (ultimosXDias !== "todos") return [];

  const finalizadas = ordenesFiltradas.filter(
    (o: OrdenProduccion) => o.estado === estados.finalizada
  );

  const resultado: Record<
    string,
    { mes: string; clave: string; desperdicio: number; produccion: number }
  > = {};

  finalizadas.forEach((o) => {
    const fecha = new Date(o.fechaCreacion);

    const clave = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}`;

    const mes = fecha.toLocaleString("es-AR", { month: "short" });

    if (!resultado[clave]) {
      resultado[clave] = {
        clave,
        mes,
        desperdicio: 0,
        produccion: 0,
      };
    }

    const planificada = o.stockRequerido ?? 0;
    const real = o.stockProducidoReal ?? 0;

    let desperdicio = planificada - real;
    if (desperdicio < 0) desperdicio = 0;

    resultado[clave].desperdicio += desperdicio;
    resultado[clave].produccion += real;
  });

  return Object.values(resultado).sort((a, b) =>
    a.clave.localeCompare(b.clave)
  );
}, [ordenesFiltradas, ultimosXDias]);

const resumenDesperdicio = useMemo(() => {
  const finalizadas = ordenesFiltradas.filter(
    (o: OrdenProduccion) => o.estado === estados.finalizada
  );

  let totalProducido = 0;
  let totalDesperdicio = 0;

  finalizadas.forEach((o) => {
    const producido = o.stockProducidoReal ?? 0;
    const requerido = o.stockRequerido ?? 0;

    let desperdicio = requerido - producido;
    if (desperdicio < 0) desperdicio = 0;

    totalProducido += producido;
    totalDesperdicio += desperdicio;
  });

  // Evitar división por cero
  const total = totalProducido + totalDesperdicio || 1;

  return [
    {
      name: "Producido",
      value: Number(((totalProducido / total) * 100).toFixed(2)),
    },
    {
      name: "Desperdiciado",
      value: Number(((totalDesperdicio / total) * 100).toFixed(2)),
    },
  ];
}, [ordenesFiltradas]);

const renderPieLabelTotal = (props: any) => {
  // props.payload es el item (ej: { name: 'Finalizadas', value: 10 })
  const label = props.payload?.name ?? props.payload?.etapa ?? props.payload?.estado ?? "";
  const value = props.value ?? props.payload?.value ?? 0;
  return `${label}: ${value}`;
};

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
<h2
  style={{
    margin: 0,
    color: "#5b088cff",
    fontSize: "30px",
    textAlign: "center",
    width: "100%",
  }}
>
  Reporte de ordenes de productos
</h2>
<div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <input
    type="date"
    value={fechaFiltro}
    onChange={(e) => {
      setFechaFiltro(e.target.value);
      setUltimosXDias("todos");
    }}
    style={{
      padding: "6px 10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      background: "#fff",
      color: "#333",
      fontSize: "14px",
      boxShadow: "0 0 5px rgba(0,0,0,0.1)",
    }}
  />

  <select
    value={ultimosXDias}
    onChange={(e) => {
      const val = e.target.value;
      setUltimosXDias(val === "todos" ? "todos" : Number(val));
      setFechaFiltro("");
    }}
    style={{
      padding: "6px 10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      background: "#fff",
      color: "#333",
      fontSize: "14px",
      cursor: "pointer",
      boxShadow: "0 0 5px rgba(0,0,0,0.1)",
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
          <Line type="monotone" dataKey={estados.enProduccion} stroke="#8c52ff" />
          <Line type="monotone" dataKey={estados.cancelada} stroke="#b13c7e" />
          <Line type="monotone" dataKey={estados.finalizada} stroke="#d88346ff" />
          <Line type="monotone" dataKey={estados.evaluacion} stroke="#f1c40f" />
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
          stroke="#82ca8c52ff9d"
          name="En Producción"
        />
        <Line
          type="monotone"
          dataKey={estados.cancelada}
          stroke="#b13c7e"
          name="Cancelada"
        />
        <Line
          type="monotone"
          dataKey={estados.finalizada}
          stroke="#d88346ff"
          name="Finalizada"
        />
        <Line
          type="monotone"
          dataKey={estados.evaluacion}
          stroke="#f1c40f"
          name="Evaluación"
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
)}

        {/* PIE: ESTADOS */}
<div className="pie-wrapper">
 <Card titulo="Producción vs Desperdicio (%)" className="pie-card">
  <ResponsiveContainer width="100%" height={200}>
    <PieChart>
      <Pie
        data={resumenDesperdicio}
        dataKey="value"
        nameKey="name"
        innerRadius={40}   // dona
        outerRadius={70}
        paddingAngle={3}
        label
        labelLine={false}  
      >
        {resumenDesperdicio.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</Card>

          {/* POR MARCA */}
<Card titulo="Producción por Etapa">
  <ResponsiveContainer width="100%" height={180}>
    <PieChart>
      <Pie
        data={produccionPorEtapa}
        dataKey="cantidad"
        nameKey="etapa"
        outerRadius={70}
        label={renderPieLabelTotal}  // solo texto, sin líneas
  labelLine={false}  
      >
        {produccionPorEtapa.map((_, i) => (
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
<Card
  titulo={
    ultimosXDias === "todos"
      ? "Producción vs Desperdicio Mensual"
      : "Producción vs Desperdicio por Fecha"
  }
  className="card-grafico"
>
  <ResponsiveContainer width="100%" height={250}>
    {ultimosXDias === "todos" ? (
      // 📊 --- GRÁFICO MENSUAL ---
      <BarChart data={desperdicioMensual}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="mes" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
        <Legend />

        <Bar dataKey="produccion" fill="#d88346ff" name="Producción" />
        <Bar dataKey="desperdicio" fill="#b13c7e" name="Desperdicio" />
      </BarChart>
    ) : (
      // 📊 --- GRÁFICO POR FECHA ---
      <BarChart data={desperdicioPorFecha}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="fecha" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
        <Legend />

        {/* SIEMPRE VS */}
        <Bar dataKey="produccion" fill="#d88346ff" name="Producción" />
        <Bar dataKey="desperdicio" fill="#b13c7e" name="Desperdicio" />
      </BarChart>
    )}
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
              <Bar dataKey="cantidad" fill="#b062ceff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card titulo="Producción y Desperdicio por Producto" className="card-grafico">
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={desperdicioPorProductoArray}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="producto" stroke="#ccc" tick={{ fontSize: 9 }} />
      <YAxis stroke="#ccc" />
      <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
      <Legend />

      <Bar dataKey="producido" fill="#d88346ff" name="Producido" />
      <Bar dataKey="desperdiciado" fill="#b13c7e" name="Desperdiciado" />
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
      background: "#151a21",
      boxShadow: "0 10px 20px rgba(32, 38, 45, 0)",
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
