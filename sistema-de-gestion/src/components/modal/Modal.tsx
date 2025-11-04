import React from "react";
import "../../styles/Modal.css";
import { FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from "react-icons/fa";

interface ModalProps {
  tipo: "confirm" | "success" | "error";
  mensaje: string;
  onConfirm?: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ tipo, mensaje, onConfirm, onClose }) => {
  const renderIcon = () => {
    switch (tipo) {
      case "confirm": return <FaQuestionCircle className="modal-icon" color="#8b5cf6" />;
      case "success": return <FaCheckCircle className="modal-icon" color="#22c55e" />;
      case "error":   return <FaExclamationCircle className="modal-icon" color="#ef4444" />;
      default: return null;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className={`modal-container modal-${tipo}`}>
        <div className="modal-content">
          {renderIcon()}
          <p className="modal-message">{mensaje}</p>
          <div className="modal-buttons">
            {tipo === "confirm" ? (
              <>
                <button className="btn-confirm" onClick={onConfirm}>Sí</button>
                <button className="btn-cancel" onClick={onClose}>No</button>
              </>
            ) : (
              <button className="btn-close" onClick={onClose}>Cerrar</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
