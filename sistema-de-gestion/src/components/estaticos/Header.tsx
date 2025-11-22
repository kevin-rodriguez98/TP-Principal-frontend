import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Nav.css";
import Notificaciones from "./Notificaciones";
import { Login as LoginIcon, Logout as LogoutIcon, AccountCircle } from "@mui/icons-material";
import { useUsuarios } from "../../Context/UsuarioContext";
import ModalCambiarPassword from "../modal/ModalCambiarPassword";

const Header = () => {
  const navigate = useNavigate();
  const { usuario, logout, modificarPassword } = useUsuarios();

  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false); // ✅ AGREGADO

  const handleIconClick = () => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    setIsUserPanelOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsUserPanelOpen(false);
    navigate("/login");
  };

  // ✅ FUNCIÓN PARA CAMBIAR CONTRASEÑA
  const manejarCambioPassword = async (actual: string, nueva: string) => {
    if (!usuario) return;

    try {
      await modificarPassword(usuario.legajo, nueva);
      setMostrarModalPassword(false);
      setIsUserPanelOpen(false);
    } catch {
      // el contexto ya muestra toast de error
    }
  };

  return (
    <nav className="navbar">
      <img
        className="title"
        src="./logo-blanco.png"
        onClick={() => navigate("/")}
        alt="Logo"
      />

      <div className="div-notify">

        <div className="user-slide-container" style={{ position: "relative" }}>
          <button className="btn-login" onClick={handleIconClick}>
            {usuario ? (
              <AccountCircle className="icon-login" />
            ) : (
              <LoginIcon className="icon-login" />
            )}
          </button>

          {/* PANEL SOLO SI HAY USUARIO */}
          {usuario && (
            <div className={`panel-user ${isUserPanelOpen ? "open" : ""}`}>
              <div className="user-details">
                <p className="user-fullname">
                  {usuario.nombre} {usuario.apellido}
                </p>
                <small>Legajo: {usuario.legajo}</small>
                <small>Rol: {usuario.rol}</small>
              </div>
                {/* ✅ BOTÓN CAMBIAR CONTRASEÑA */}
              <button
                className="btn-change-pass"
                onClick={() => setMostrarModalPassword(true)}
              >
                Cambiar contraseña
              </button>
              <hr className="divider" />


              {/* BOTÓN LOGOUT */}
              <button className="btn-logout" onClick={handleLogout}>
                <LogoutIcon fontSize="small" /> <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>

        <Notificaciones />
      </div>

      {/* ✅ MODAL CAMBIAR CONTRASEÑA */}
      {mostrarModalPassword && (
        <ModalCambiarPassword
          onClose={() => setMostrarModalPassword(false)}
          onSubmit={manejarCambioPassword}
        />
      )}
    </nav>
  );
};

export default Header;