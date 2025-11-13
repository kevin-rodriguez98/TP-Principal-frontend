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
                { label: "Gestionar insumos", onClick: () => navigate("/PanelGestion/0") },
                { label: "Gestionar registros", onClick: () => navigate("/PanelGestion/1") }
            ]
        },

        {
            label: "Gestión de Producción",
            icon: './produccion.png',
            acciones: [
                { label: "Gestionar Productos", onClick: () => navigate("/PanelGestion/2") },
                { label: "Gestionar Ordenes", onClick: () => navigate("/PanelGestion/3") },
            ]
        },

        {
            label: "Reportes",
            icon: './reportes.png',
            acciones: [
                { label: "Reportes de insumos", onClick: () => navigate("/reportes/insumos") },
                { label: "Reportes de producción", onClick: () => navigate("/reportes/ordenes") },
            ]
        }
    ];


    return (
        <OpContext.Provider value={{ modulos }}>
            {children}
        </OpContext.Provider>
    );
}
