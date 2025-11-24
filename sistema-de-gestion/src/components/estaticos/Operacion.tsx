import { useState } from 'react';
import '../../styles/Operacion.css'
import { AnimatePresence, motion } from 'framer-motion';
import { type Modulo } from '../../Context/OpContext';


const Operacion: React.FC<{ modulo: Modulo }> = ({ modulo }) => {

    const [mostrarSubmenu, setMostrarSubmenu] = useState(false);

    return (
        <div className='operacion'
            style={{ "--op-color": modulo.color } as React.CSSProperties}
            onMouseEnter={() => setMostrarSubmenu(true)}
            onMouseLeave={() => setMostrarSubmenu(false)}
        >
            {modulo.icon}
            <label className='label' >{modulo.label}</label>
            <p className="subtitle" style={{fontSize: "15px", color: "#ffffff94"}}>{modulo.subtitle}</p>
            <AnimatePresence>
                {mostrarSubmenu && (
                    <motion.div
                        className="submenu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {modulo.acciones.map((accion, index) => (
                            <motion.button
                                key={index}
                                className="submenu-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={accion.onClick}
                            >
                                {accion.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default Operacion
