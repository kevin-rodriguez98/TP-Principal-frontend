import { useNavigate } from 'react-router-dom';
import '../styles/Nav.css'
import Notificaciones from './Notificaciones';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div>
            <nav className="navbar">
                <div className="navbar-left" onClick={() => navigate("/")} >
                    <img className='title'  src='./logo-blanco.png'/>
                </div>
            <div className="navbar-right">
                <Notificaciones />
            </div>
            </nav>
        </div>



    )
}

export default Header
