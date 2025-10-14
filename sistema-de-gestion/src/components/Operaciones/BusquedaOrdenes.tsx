import React, { useContext, useEffect } from "react";
import { RiResetRightFill } from "react-icons/ri";
import { OrdenProduccionContext } from "../../Context/OrdenesContext";
import "../../styles/cuadroBusqueda.css";

const BusquedaOrdenes = () => {
  const { filtros, setFiltros } = useContext(OrdenProduccionContext)!;

  useEffect(() => {
    setFiltros({
      codigo: "",
      estado: "TODOS",
    });
  }, []);

  const handleFilter = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFiltros((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = (e?: React.FormEvent) => {
    e?.preventDefault();
    setFiltros({
      codigo: "",
      estado: "TODOS",
    });
  };

  return (
    <form
      className="form-buscar"
      onSubmit={(e) => {
        e.preventDefault();
        handleReset();
      }}
    >
      <input
        type="text"
        name="codigo"
        value={filtros.codigo || ""}
        placeholder="Código..."
        onChange={handleFilter}
      />

      <select name="estado" value={filtros.estado || "TODOS"} onChange={handleFilter}>
        <option value="TODOS">TODOS</option>
        <option value="PENDIENTE">PENDIENTE</option>
        <option value="EN PROGRESO">EN PROGRESO</option>
        <option value="FINALIZADO">FINALIZADO</option>
      </select>

      <button type="submit" title="Reiniciar filtros" className="btn-reset">
        <RiResetRightFill />
      </button>
    </form>
  );
};

export default BusquedaOrdenes;