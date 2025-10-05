import { useState } from 'react';
import '../styles/Operacion.css'
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';

interface OperacionProps {
    label: string;
    icon: string;
    route: string;
    acciones: string[];
}


const Operacion: React.FC<OperacionProps> = ({ label, icon, acciones, route }) => {

    const [mostrarSubmenu, setMostrarSubmenu] = useState(false);


    const navigate = useNavigate();
    return (
        <div className='operacion'
            onMouseEnter={() => setMostrarSubmenu(true)}
            onMouseLeave={() => setMostrarSubmenu(false)}
        >
            <img src={icon} alt={label} className='operacion-icon' />
            <label className='label' >{label}</label>

            <AnimatePresence>
                {mostrarSubmenu && (
                    <motion.div
                        className="submenu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {acciones.map((accion, index) => (
                            <motion.button
                                key={index}
                                className="submenu-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(route)}
                            >
                                {accion}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default Operacion
