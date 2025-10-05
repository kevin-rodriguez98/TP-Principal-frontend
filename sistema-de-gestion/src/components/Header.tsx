import { useNavigate } from 'react-router-dom';
import '../styles/Nav.css'
const Header = () => {
    const navigate = useNavigate();

    return (
        <div>
            <nav className="nav">
                <div className="logo" onClick={() => navigate("/")} >
                    <h1 className='title' >Frozen Lácteos</h1>
                </div>
            </nav>
        </div>
    )
}

export default Header
