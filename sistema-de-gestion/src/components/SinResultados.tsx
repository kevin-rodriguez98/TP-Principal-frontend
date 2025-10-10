import { BiSad } from "react-icons/bi";
import "../styles/SinResultados.css";


interface SinResultadosProps {
    titulo?: string;         // Texto principal
    mensaje?: string;        // Texto secundario
    className?: string;      // Estilos adicionales personalizados
}

const SinResultados = ({
    titulo = "No se encontraron resultados",
    mensaje = "Reintentalo nuevamente",
}: SinResultadosProps) => {
    return (
        <div className="sin-resultados">
            <BiSad className="icono-triste" />
            <h3>{titulo}</h3>
            <p>{mensaje}</p>
        </div>
    );
};

export default SinResultados;
