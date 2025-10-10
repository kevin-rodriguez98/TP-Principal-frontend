import { BiSad } from "react-icons/bi";
import "../styles/SinResultados.css";

const SinResultados = () => {
    return (
        <div className="sin-resultados">
            <BiSad className="icono-triste" />
            <h3>No se encontraron Insumos</h3>
            <p>Reintentalo nuevamente</p>
        </div>
    );
};

export default SinResultados;