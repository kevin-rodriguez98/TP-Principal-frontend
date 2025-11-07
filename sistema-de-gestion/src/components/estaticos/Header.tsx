import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Nav.css';
import Notificaciones from './Notificaciones';
import { Login as LoginIcon } from "@mui/icons-material";


const Header = () => {
  const navigate = useNavigate();
  const [, setShowLogin] = useState(false);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <img className='title' src='./logo-blanco.png' onClick={() => navigate("/")} />
        <div className='div-notify'>
        <button className="btn-login" onClick={() => handleLoginSuccess()}>
          <LoginIcon className="icon-login" />
        </button>
        <Notificaciones />
        </div>
      </nav>
    </>
  );
};

export default Header;


