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
}

const HistorialEtapas: React.FC<HistorialEtapasProps> = ({ ordenId }) => {
    const [historial, setHistorial] = useState<Etapa[]>([]);
    const [loading, setLoading] = useState(true);

    const { obtenerHistorialEtapas, ordenes } = useContext(OrdenesContext)!;

    const ordenActual = ordenes?.find((o) => o.id === ordenId);

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
            <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
                <CircularProgress color="info" size={24} />
            </Box>
        );

    if (historial.length === 0)
        return (
            <Typography sx={{ color: "#ccc", fontStyle: "italic", mt: 1, textAlign: "center" }}>
                No hay historial de etapas registrado.
            </Typography>
        );

    return (
        <Box className="timeline-container">
            <Typography variant="subtitle1" sx={{ mb: 1, color: "#15a017ff", fontWeight: 600 }}>
                Trazabilidad de la Órden
            </Typography>

            <ul className="timeline compact">
                {historial.map((etapa) => (
                    <li key={etapa.id} className="timeline-item">
                        <div className={`timeline-marker ${etapa.etapa.toLowerCase()}`}></div>
                        <div className="timeline-content">
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {etapa.etapa.replaceAll("_", " ")}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#ccc" }}>
                                {new Date(etapa.fecha).toLocaleString()}
                            </Typography>
                        </div>
                    </li>
                ))}
            </ul>

            {ordenActual?.nota && (
                <Box sx={{ mt: 1.5, p: 1.2, background: "#1e1e1e", borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                        📝 Nota: {ordenActual.nota}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default HistorialEtapas;
