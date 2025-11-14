import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Nav.css";
import Notificaciones from "./Notificaciones";
import { Login as LoginIcon, Logout as LogoutIcon, AccountCircle } from "@mui/icons-material";
import { useFaceAuth } from "../../Context/FaceAuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useFaceAuth();
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);

  const handleIconClick = () => {
    if (user) {
      setIsUserPanelOpen((prev) => !prev); 
      navigate("/login");
  };
};
  const handleLogout = () => {
    logout();
    setIsUserPanelOpen(false);
    navigate("/login");
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
        {/* --- Botón de login o usuario --- */}
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
              <hr className="divider" />
              <button className="btn-logout" onClick={handleLogout}>
                <LogoutIcon fontSize="small" /> <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>

        <Notificaciones />
      </div>
    </nav>
  );
};

export default Header;

