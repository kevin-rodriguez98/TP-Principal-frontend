import React, { createContext, useContext, useEffect, useState } from "react";
import { InsumoContext } from "./InsumoContext";

export interface Notificacion {
    id: string;
    codigoInsumo?: string; // identificador único para evitar duplicados
    titulo: string;
    mensaje: string;
    tipo?: "info" | "warning" | "error" | "success";
    fecha?: Date;
    leida?: boolean;
}

interface NotifyContextType {
    notify: Notificacion[];
    is_slide_open: boolean;
    togglePanel: () => void;
    eliminarNotificacion: (id: string) => void;
    limpiarNotificaciones: () => void;
    cargarStockBajo: (insumos_bajo_stock: any[]) => void;
    notisNoLeidas: number; // contador de notis no leídas
}

export const PanelContext = createContext<NotifyContextType | undefined>(undefined);

interface NotifyProviderProps {
    children: React.ReactNode;
}

export const PanelProvider = ({ children }: NotifyProviderProps) => {
    const [notify, setNotify] = useState<Notificacion[]>([]);
    const [is_slide_open, set_is_slide_open] = useState(false);
    const { insumos_bajo_stock } = useContext(InsumoContext)!;

    // Contador de notificaciones no leídas
    const notisNoLeidas = notify.filter(n => !n.leida).length;

    // Cada vez que cambian los insumos bajo stock, agregamos nuevas notificaciones
    useEffect(() => {
        cargarStockBajo(insumos_bajo_stock);
    }, [insumos_bajo_stock]);

    const togglePanel = () => {
        set_is_slide_open(prev => {
            const nuevoEstado = !prev;

            // Si abrimos el panel, marcamos todas como leídas
            if (!prev) {
                setNotify(prevNotis =>
                    prevNotis.map(n => (n.leida ? n : { ...n, leida: true }))
                );
            }

            return nuevoEstado;
        });
    };

    const eliminarNotificacion = (id: string) => {
        setNotify(prev => prev.filter(n => n.id !== id));
    };

    const limpiarNotificaciones = () => {
        setNotify([]);
    };

    const cargarStockBajo = (insumos_bajo_stock: any[]) => {
        if (!insumos_bajo_stock || insumos_bajo_stock.length === 0) return;

        setNotify(prev => {
            // Solo agregamos los insumos que aún no tienen notificación
            const nuevasNotis = insumos_bajo_stock
                .filter(item => !prev.some(n => n.codigoInsumo === item.codigo))
                .map(item => ({
                    id: crypto.randomUUID(),
                    codigoInsumo: item.codigo,
                    titulo: "⚠️ BAJO Stock",
                    mensaje: `El producto ${item.nombre} de ${item.marca} tiene solo ${item.stock} unidades (mínimo: ${item.umbralMinimoStock})`,
                    tipo: "warning" as const,
                    fecha: new Date(),
                    leida: false,
                }));

            return [...nuevasNotis, ...prev];
        });
    };

    return (
        <PanelContext.Provider
            value={{
                notify,
                is_slide_open,
                togglePanel,
                eliminarNotificacion,
                limpiarNotificaciones,
                cargarStockBajo,
                notisNoLeidas,
            }}
        >
            {children}
        </PanelContext.Provider>
    );
};
