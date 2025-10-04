import Operacion from '../components/Operacion.tsx'
import '../styles/Main.css'



const Main = () => {

    const modules = [

        { label: "Gestión de Stock", icon: './stock.png',  route: "/GestionStock" },
        { label: "Planificación de Producción", icon:'./produccion.png', route: "/produccion"},
        { label: "Seguimiento de Producción", icon:'./seguimiento.png', route: "/planificacion-produccion"},
        { label: "Trazabilidad de Producción", icon: './calidad.png', route: "/trazabilidad-produccion" },
        { label: "Reportes", icon: './reportes.png',route: "/reportes" }
    ];
    return (
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
                            route={mod.route}
                        />
                    ))}

                </div>
            </div>
    )
}

export default Main
