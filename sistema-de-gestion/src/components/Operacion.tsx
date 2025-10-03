import '../styles/Operacion.css'

interface OperacionProps {
    label: string;
    icon: string; // URL o path de la imagen
}


const Operacion: React.FC<OperacionProps> = ({ label, icon }) => {

    return (
        <div className='boton'>
            <img src={icon} alt={label} />
        </div>
    )
}

export default Operacion
