import { useNavigate } from 'react-router-dom';
import '../styles/Nav.css'
const Header = () => {
    const navigate = useNavigate();
    const estilosTitulo = {
        fontFamily: "Times New Roman",
        fontSize:"26px",
    };

    return (
        <div>
            <nav className="nav">
                <div className="logo" onClick={() => navigate("/")} >
                    <h1 style={estilosTitulo}>Frozen Lácteos</h1>
                </div>
            </nav>
        </div>
    )
}

export default Header
