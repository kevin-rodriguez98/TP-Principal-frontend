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
      case "confirm": return <FaQuestionCircle className="modal-icon" color="#914ef0" />;
      case "success": return <FaCheckCircle className="modal-icon" color= "#26ff00ff"/>;
      case "error":   return <FaExclamationCircle className="modal-icon" color="#ff0000ff" />;
      default: return null;
    }
  }

  return (
    <div className="modal-backdrop">
      <div className={`modal modal-${tipo}`}>
        <p>{renderIcon()}{mensaje}</p>
        <div className="modal-buttons">
          {tipo === "confirm" && (
            <>
              <button className="btn-confirm" onClick={onConfirm}>Sí</button>
              <button className="btn-cancel" onClick={onClose}>No</button>
            </>
          )}
          {tipo !== "confirm" && (
            <button className="btn-close" onClick={onClose}>Cerrar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;