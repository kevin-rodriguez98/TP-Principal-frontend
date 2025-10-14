import { useState } from "react";
import "../../styles/Ordenes.css";

const ModalAgregarInsumo = ({ onClose, onSave }) => {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");

  const handleGuardar = () => {
    if (!codigo || !nombre || !unidad || !cantidad) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onSave({ codigo, nombre, unidad, cantidad });
    setCodigo("");
    setNombre("");
    setUnidad("");
    setCantidad("");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2>Agregar insumo</h2>
        <div className="modal-form">
          <label>Código:</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label>Unidad:</label>
          <input
            type="text"
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
          />
          <label>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <div className="modal-buttons">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarInsumo;