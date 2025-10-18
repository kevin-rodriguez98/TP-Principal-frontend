import { useNavigate } from 'react-router-dom';
import '../styles/Nav.css'
import Notificaciones from './Notificaciones';

const Header = () => {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <img className='title' src='./logo-blanco.png' onClick={() => navigate("/")} />
            <Notificaciones />
        </nav>
    )
}

export default Header
