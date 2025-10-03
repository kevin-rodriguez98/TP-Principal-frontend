import Operacion from '../components/Operacion.tsx'
import '../styles/Main.css'



const Main = () => {

    const modules = [
        // { label: "Gestión de Stock", icon: './stock.png', route: "/gestion-stock", color: "#4caf50" },
        // { label: "Planificación de Producción", icon:'./produccion.png', route: "/planificacion-produccion", color: "#2196f3" },
        // { label: "Seguimiento de Producción", icon:'./seguimiento.png', route: "/seguimiento-produccion", color: "#ff9800" },
        // { label: "Trazabilidad de Producción", icon: './calidad', route: "/trazabilidad-produccion", color: "#9c27b0" },
        // { label: "Reportes", icon: './reportes.png', route: "/reportes", color: "#f44336" }

        { label: "Gestión de Stock", icon: './stock.png'},
        { label: "Planificación de Producción", icon:'./produccion.png'},
        { label: "Seguimiento de Producción", icon:'./seguimiento.png'},
        { label: "Trazabilidad de Producción", icon: './calidad.png' },
        { label: "Reportes", icon: './reportes.png' }
    ];
    return (
        <>
            <div className='div-main'>
                <div className='div-titulo'>
                    <h2>Menu de operaciones</h2>
                </div>
                <div className='div-OP'>
                    {modules.map((mod, i) => (
                        <Operacion
                            key={i}
                            label={mod.label}
                            icon={mod.icon}
                        />
                    ))}

                </div>
            </div>
        </>
    )
}

export default Main
