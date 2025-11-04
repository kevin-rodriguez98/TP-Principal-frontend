import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import "../../../styles/historialEtapas.css";
import { OrdenesContext } from "../../../Context/OrdenesContext";

interface HistorialEtapasProps {
    ordenId: number;
}

interface Etapa {
    id: number;
    etapa: string;
    fecha: string;
    nota?: string;
}

const HistorialEtapas: React.FC<HistorialEtapasProps> = ({ ordenId }) => {
    const [historial, setHistorial] = useState<Etapa[]>([]);
    const [loading, setLoading] = useState(true);

    // const { historial, setHistorial } = useContext(OrdenesContext)!;


    const { obtenerHistorialEtapas } = useContext(OrdenesContext)!;

    useEffect(() => {
        fetchHistorial();
    }, []);

    const fetchHistorial = async () => {
        const data = await obtenerHistorialEtapas(ordenId);
        setHistorial(data);
        setLoading(false);
    };


    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress color="info" />
            </Box>
        );

    if (historial.length === 0)
        return (
            <Typography sx={{ color: "#ccc", fontStyle: "italic", mt: 1 }}>
                No hay historial de etapas registrado.
            </Typography>
        );

    return (
        <Box className="timeline-container">
            <Typography variant="h6" sx={{ mb: 2, color: "#15a017ff" }}>
                Historial de Etapas
            </Typography>
            <ul className="timeline">
                {historial.map((etapa) => (
                    <li key={etapa.id} className="timeline-item">
                        <div className={`timeline-marker ${etapa.etapa.toLowerCase()}`}></div>
                        <div className="timeline-content">
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {etapa.etapa.replaceAll("_", " ")}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#ddd" }}>
                                {new Date(etapa.fecha).toLocaleString()}
                            </Typography>
                            {etapa.nota && (
                                <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 0.5 }}>
                                    📝 {etapa.nota}
                                </Typography>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default HistorialEtapas;
