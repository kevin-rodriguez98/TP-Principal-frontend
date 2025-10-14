import { useNavigate } from 'react-router-dom';
import '../styles/Nav.css';
import Notificaciones from './Notificaciones';

const Header = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-left" onClick={() => navigate("/")}>
                <h1 className="title">Frozen Lácteos</h1>
            </div>
            <div className="navbar-right">
                <Notificaciones />
            </div>
        </nav>
    );
};

export default Header;
