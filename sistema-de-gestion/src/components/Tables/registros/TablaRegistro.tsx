import React, { useState } from "react";
import { Box, Tabs, Tab, Paper, Typography } from "@mui/material";
import  TablaIngreso  from "./TablaIngreso";
import TablaEgreso from "./TablaEgreso";

const TablaRegistro: React.FC = () => {
    const [tabActiva, setTabActiva] = useState(0);

    return (
        <Paper
            elevation={6}
            sx={{
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                backgroundColor: "#111827",
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
                    borderBottom: "1px solid #150e23ff",
                    display: "flex",
                    justifyContent: "center", // 🔹 Centrado horizontal
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
                        backgroundColor: "#8c52ff",
                        height: "4px",
                        borderRadius: "2px",
                    },
                }}
                sx={{
                    backgroundColor: "#111827",
                    "& .MuiTab-root": {
                        textTransform: "none",
                        color: "#b0b0b0",
                        transition: "all 0.3s ease",
                    },
                    "& .Mui-selected": {
                        color: "#b13c7e",
                        backgroundColor: "#0e1217",
                    },
                    "& .MuiTabs-flexContainer": {
                        borderBottom: "1px solid #150e23ff",
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
                    backgroundColor: "#111827",
                    borderTop: "1px solid #150e23ff",
                    borderRadius: "0 0 16px 16px",
                }}
            >
                {tabActiva === 0 && <TablaIngreso />}
                {tabActiva === 1 && <TablaEgreso />}
            </Box>
        </Paper>
    );
};

export default TablaRegistro;
