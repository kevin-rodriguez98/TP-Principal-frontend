import React, { useContext, useState, type JSX } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import InsumosBajoStock from "./InsumosBajoStock";
import ListaInsumos from "./ListaInsumos";
import "../../../styles/tablas.css";
import { PERMISOS } from "../../../Context/PanelContext";
import { AuthContext } from "../../../Context/AuthContext";

const Tabla: React.FC = () => {
    const { user } = useContext(AuthContext)!; // dentro del componente
    const rol = user?.rol?.toLowerCase() as keyof typeof PERMISOS | undefined;
const permisos = rol ? PERMISOS[rol] : PERMISOS.operario;

    const [tabActiva, setTabActiva] = useState(0);

    // Solo mostrar pestaña de "Insumos bajo Stock" si tiene permiso
    const pestañasDisponibles = [
        { label: "Lista Insumos", componente: <ListaInsumos /> },
        permisos.crearInsumos || permisos.crearProductos
            ? { label: "Insumos bajo Stock", componente: <InsumosBajoStock /> }
            : null,
    ].filter(Boolean) as { label: string; componente: JSX.Element }[];

//     const handleCrearInsumo = () => {
//     if (!permisos.crearInsumos) return; // ❌ no hace nada si no tiene permiso
//     // código para crear insumo
// };

    return (
        <Paper
            elevation={6}
            sx={{
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "#0e1217",
                color: "#e0e0e0",
                boxShadow: "0px 4px 25px rgba(0,0,0,0.6)",
            }}
        >
            {/* Encabezado */}
            <Box
                sx={{
                    backgroundColor: "#111827",
                    py: 2,
                    px: 3,
                    borderBottom: "1px solid #311e55",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: "#8c52ff",
                        textAlign: "center",
                        letterSpacing: "1px",
                    }}
                >
                    Gestión de Insumos
                </Typography>
            </Box>

            {/* Pestañas */}
            <Tabs
                value={tabActiva}
                onChange={(_, nueva) => setTabActiva(nueva)}
                variant="fullWidth"
                textColor="inherit"
                TabIndicatorProps={{
                    style: {
                        backgroundColor: "#b13c7e",
                        height: "4px",
                        borderRadius: "2px",
                    },
                }}
                sx={{
                    backgroundColor: "#130f25ff",
                    "& .MuiTab-root": {
                        textTransform: "none",
                        color: "#b0b0b0",
                        transition: "all 0.3s ease",
                    },
                    "& .Mui-selected": {
                        color: "#8c52ff",
                        backgroundColor: "#111827",
                    },
                    "& .MuiTabs-flexContainer": {
                        borderBottom: "1px solid #311e55",
                    },
                }}
            >
                {pestañasDisponibles.map((p, i) => (
                    <Tab key={i} label={p.label} />
                ))}
            </Tabs>

            {/* Contenido */}
            <Box
                sx={{
                    mt: 1,
                    p: 3,
                    minHeight: 500,
                    backgroundColor: "#111827",
                    borderTop: "1px solid #311e55",
                    borderRadius: "0 0 16px 16px",
                }}
            >
                {pestañasDisponibles[tabActiva]?.componente}
            </Box>
        </Paper>
    );
};

export default Tabla;
