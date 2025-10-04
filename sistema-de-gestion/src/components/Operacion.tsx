import '../styles/Operacion.css'
import { useNavigate } from "react-router-dom";

interface OperacionProps {
    label: string;
    icon: string;
    route:string
}


const Operacion: React.FC<OperacionProps> = ({ label, icon, route}) => {
    
    const navigate = useNavigate();
    return (
        <div className='operacion' onClick={() => navigate(route)} >
            <img src={icon} alt={label} className='operacion-icon'/>
            <label className='label' >{label}</label>
        </div>
    )
}

export default Operacion
