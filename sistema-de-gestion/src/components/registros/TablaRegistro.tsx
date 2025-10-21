import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import TablaInsumos from "./TablaInsumos";
import TablaProductos from "./TablaProductos";

const TablaRegistro: React.FC = () => {
    const [tabActiva, setTabActiva] = useState(0);

    return (
        <Paper
            elevation={6}
            sx={{
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "#1e1e1e",
                color: "#e0e0e0",
                boxShadow: "0px 4px 25px rgba(0,0,0,0.6)",
            }}
        >
            {/* Encabezado */}
            <Box
                sx={{
                    backgroundColor: "#121212",
                    py: 2,
                    px: 3,
                    borderBottom: "1px solid #333",
                    display: "flex",
                    justifyContent: "center", // 🔹 Centrado horizontal
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "bold",
                        color: "#90caf9",
                        textAlign: "center",
                        letterSpacing: "1px",
                    }}
                >
                    Gestión de Registros
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
                        backgroundColor: "#00fff7ff",
                        height: "4px",
                        borderRadius: "2px",
                    },
                }}
                sx={{
                    backgroundColor: "#2b2b2b",
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: "bold",
                        color: "#b0b0b0",
                        transition: "all 0.3s ease",
                    },
                    "& .Mui-selected": {
                        color: "#42a5f5",
                        backgroundColor: "#1e1e1e",
                    },
                    "& .MuiTabs-flexContainer": {
                        borderBottom: "1px solid #333",
                    },
                }}
            >
                <Tab label="Ingreso" />
                <Tab label="Egreso" />
            </Tabs>

            {/* Contenido */}
            <Box
                sx={{
                    mt: 1,
                    p: 3,
                    minHeight: 500,
                    backgroundColor: "#121212",
                    borderTop: "1px solid #333",
                    borderRadius: "0 0 16px 16px",
                }}
            >
                {tabActiva === 0 && <TablaInsumos />}
                {tabActiva === 1 && <TablaProductos />}
            </Box>
        </Paper>
    );
};

export default TablaRegistro;
