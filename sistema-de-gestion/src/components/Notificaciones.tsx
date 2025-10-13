import React, { useContext } from "react";
import { PanelContext } from "../Context/PanelContext";
import { Bell } from "lucide-react";
import '../styles/notificacion.css';

const Notificaciones: React.FC = () => {
    const { notify, is_slide_open, togglePanel, notisNoLeidas } = useContext(PanelContext)!;

    return (
        <div className="notificaciones-container" style={{ position: "relative" }}>
            <button className="btn-notify" onClick={togglePanel}>
                <Bell />
                {notisNoLeidas > 0 && <span className="badge">{notisNoLeidas}</span>}
            </button>

            <div className={`panel-notificaciones ${is_slide_open ? "open" : ""}`}>
                {notify.length === 0 ? (
                    <p style={{ padding: "12px", color: "#666" }}>Sin notificaciones</p>
                ) : (
                    notify.map((n) => (
                        <div key={n.id} className="noti-item">
                            <p className="noti-titulo">{n.titulo}</p>
                            <p className="noti-mensaje">{n.mensaje}</p>
                            {n.fecha && (
                                <p className="noti-fecha">{n.fecha.toLocaleString()}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notificaciones;
