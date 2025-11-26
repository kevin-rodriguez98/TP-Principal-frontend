import { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';
import { AuthContext } from '../Context/AuthContext';

const NotFound = () => {
    const { user } = useContext(AuthContext)!;

    return (
        <div className="not-found">
            <h1>404</h1>
            <h2>Página no encontrada</h2>
            <p>La ruta que estás buscando no existe.</p>

            {user ? (
                <Link to="/menu" className="back-home">
                    Volver al inicio
                </Link>
            ) : (
                <Link to="/login" className="back-home">
                    Volver al inicio
                </Link>
            )}
        </div>
    );
};

export default NotFound;
