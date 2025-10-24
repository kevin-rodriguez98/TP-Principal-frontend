import { createContext} from 'react';
import { useNavigate } from "react-router-dom";

interface OpContextType {
    modulos: Modulo[];
}
export const OpContext = createContext<OpContextType | undefined>(undefined);

interface OpProviderProps {
    children: React.ReactNode;
}

interface Accion {
    label: string;
    onClick: () => void;
}

export interface Modulo {
    label: string;
    icon: string;
    acciones: Accion[];
}

export function OpProvider({ children }: OpProviderProps) {

    const navigate = useNavigate();

    const modulos: Modulo[] = [
        {
            label: "Gestión de Stock",
            icon: './stock.png',
            acciones: [
                { label: "Gestionar insumos", onClick: () => navigate("/gestion-stock") },
                { label: "Gestionar registros", onClick: () => navigate("/registro") }
            ]
        },

        {
            label: "Planificación de Producción",
            icon: './produccion.png',
            acciones: [
                { label: "Gestionar Ordenes", onClick: () => navigate("/ordenes") },
                { label: "Gestionar Productos", onClick: () => navigate("/produccion") },

            ]
        },

        {
            label: "Seguimiento de Producción",
            icon: './seguimiento.png',
            acciones: [
                { label: "", onClick: () => navigate("/") },
                { label: "", onClick: () => navigate("/") }
            ]
        },

        {
            label: "Trazabilidad de Producción",
            icon: './calidad.png',
            acciones: [
                { label: "", onClick: () => navigate("/") },
                { label: "", onClick: () => navigate("/") }
            ]
        },

        {
            label: "Reportes",
            icon: './reportes.png',
            acciones: [
                { label: "", onClick: () => navigate("/") },
                { label: "", onClick: () => navigate("/") }
            ]
        }
    ];


    return (
        <OpContext.Provider value={{ modulos }}>
            {children}
        </OpContext.Provider>
    );
}
