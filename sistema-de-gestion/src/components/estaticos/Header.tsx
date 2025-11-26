import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Nav.css";
import Notificaciones from "./Notificaciones";
import { Login as LoginIcon, Logout as LogoutIcon, AccountCircle } from "@mui/icons-material";
import ModalCambiarPassword from "../modal/ModalCambiarPassword";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthContext } from "../../Context/AuthContext";


const Header = () => {
  const navigate = useNavigate();
  const { user, logout, modificarPassword } = useContext(AuthContext)!;
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);

  const handleIconClick = () => {
    if (!user) {
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

  const manejarCambioPassword = async (_actual: string, nueva: string) => {
    if (!user) return;

    try {
      await modificarPassword(user.legajo, nueva);
      setMostrarModalPassword(false);
      setIsUserPanelOpen(false);
    } catch {
      // el contexto ya muestra toast de error
    }
  };


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <nav className="navbar">

      <div className="logo-div">

        {/* LOGO como botón */}
        <img
          className="title"
          src="./logo-blanco.png"
          onClick={() => navigate("/menu")}
          alt="Logo"
        />

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-white" style={{ color: "white", fontSize: isMobile ? "1rem" : "3rem" }}>
          <span style={{ color: "#b13c7e", padding: "5px" }}>FROZEN</span> Dashboard
        </h1>
      </div>
      <div className="div-notify">

        <div className="user-slide-container" style={{ position: "relative" }}>
          <button className="btn-login" onClick={handleIconClick}>
            {user ? (
              <AccountCircle className="icon-login" />
            ) : (
              <LoginIcon className="icon-login" />
            )}
          </button>

          {user && (
            <div className={`panel-user ${isUserPanelOpen ? "open" : ""}`}>
              <div className="user-details">
                <p className="user-fullname">
                  {user.nombre} {user.apellido}
                </p>
                <small>Legajo: {user.legajo}</small>
                <small>Rol: {user.rol}</small>
              </div>
              <button
                className="btn-change-pass"
                onClick={() => setMostrarModalPassword(true)}
              >
                Cambiar contraseña
              </button>
              <hr className="divider" />

              {/* BOTÓN LOGOUT */}
              <button className="btn-logout-dashboard" onClick={handleLogout}>
                <LogoutIcon fontSize="small" /> <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>

        <Notificaciones />
      </div>

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