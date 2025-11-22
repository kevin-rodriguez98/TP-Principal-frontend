import React, { useState } from "react";
import "../../styles/Modal.css";
import { FaLock } from "react-icons/fa";

interface ModalCambiarPasswordProps {
  onClose: () => void;
  onSubmit: (actual: string, nueva: string) => void;
}

const ModalCambiarPassword: React.FC<ModalCambiarPasswordProps> = ({
  onClose,
  onSubmit,
}) => {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [error, setError] = useState("");

  const manejarConfirmar = () => {
    if (!actual || !nueva || !repetir)
      return setError("Todos los campos son obligatorios");

    if (nueva !== repetir)
      return setError("Las nuevas contraseñas no coinciden");

    setError("");
    onSubmit(actual, nueva);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container modal-confirm">
        <div className="modal-content">

          <FaLock className="modal-icon" color="#8b5cf6" />
          <h3 className="modal-title">Cambiar contraseña</h3>

          <div className="modal-inputs">
            <input
              type="password"
              placeholder="Contraseña actual"
              className="modal-input"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
            />

            <input
              type="password"
              placeholder="Nueva contraseña"
              className="modal-input"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
            />

            <input
              type="password"
              placeholder="Repetir nueva contraseña"
              className="modal-input"
              value={repetir}
              onChange={(e) => setRepetir(e.target.value)}
            />

            {error && <p className="modal-error">{error}</p>}
          </div>

          <div className="modal-buttons">
            <button className="btn-confirm" onClick={manejarConfirmar}>
              Confirmar
            </button>
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCambiarPassword;