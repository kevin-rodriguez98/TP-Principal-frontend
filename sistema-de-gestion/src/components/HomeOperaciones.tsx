import Operacion from './Operacion.tsx'
import '../styles/Main.css'

const HomeOperaciones = () => {

    const modules = [

        { label: "Gestión de Stock", icon: './stock.png',  route: "/GestionStock", acciones: ["Gestionar insumos", "Registro insumos" ] },
        { label: "Planificación de Producción", icon:'./produccion.png', route: "/produccion",acciones: [""]},
        { label: "Seguimiento de Producción", icon:'./seguimiento.png', route: "/planificacion-produccion", acciones: [""]},
        { label: "Trazabilidad de Producción", icon: './calidad.png', route: "/trazabilidad-produccion",acciones: [""] },
        { label: "Reportes", icon: './reportes.png',route: "/reportes", acciones: [""] }
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
                            acciones={mod.acciones}
                        />
                    ))}

                </div>
            </div>
    )
}

export default HomeOperaciones
