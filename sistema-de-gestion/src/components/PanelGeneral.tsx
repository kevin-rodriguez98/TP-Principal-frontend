import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Tabs, Tab, Typography, CssBaseline, Paper, Button } from "@mui/material";
import { darkScrollbar } from "@mui/material";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { Select, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Tabla from "./Tables/insumos/Tabla";
import TablaOrden from "./Tables/ordenes/TablaOrden";
import TablaProductos from "./Tables/ordenes/TablaProductos";
import TablaRegistro from "./Tables/registros/TablaRegistro";


const TabPanel = ({ children, value, index }: any) => {
    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#90caf9" },
        secondary: { main: "#f48fb1" },
        background: {
            default: "#121212",
            paper: "#1e1e1e",
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: darkScrollbar(),
            },
        },
    },
});

export default function PanelGeneral({}) {
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { id } = useParams<{ id?: string }>();
    const [value, setValue] = useState(Number(id) || 0);

    useEffect(() => {
        if (id !== undefined) {
            setValue(Number(id));
        }
    }, [id]);


    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", backgroundColor: "transparent" }}>
                <Paper elevation={3} sx={{ mx: 4, mt: 4, borderRadius: 2 }}>
                    {isMobile ? (
                        // 📱 Menú desplegable en mobile
                        <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
                            <Button
                                onClick={() => navigate("/")}
                                variant="contained"
                                sx={{
                                    backgroundColor: "#2b2b2b",
                                    color: "#fff",
                                    borderRadius: "30px",
                                    padding: "6px 12px",
                                    minWidth: "auto",
                                    "&:hover": { backgroundColor: "#444" },
                                }}
                            >
                                <IoArrowBackCircleSharp size={24} style={{ color: "#ff4b4b" }} />
                            </Button>

                            <Select
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                fullWidth
                                sx={{
                                    backgroundColor: "#1e1e1e",
                                    color: "#fff",
                                    borderRadius: "10px",
                                    "& .MuiSvgIcon-root": { color: "#fff" },
                                }}
                            >
                                <MenuItem value={0}>Gestión de Insumos</MenuItem>
                                <MenuItem value={1}>Registros de Ingreso/Egreso</MenuItem>
                                <MenuItem value={2}>Órdenes de Producción</MenuItem>
                                <MenuItem value={3}>Productos</MenuItem>
                            </Select>
                        </Box>
                    ) : (
                        // 💻 Pestañas en desktop
                        <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>

                            <Button
                                onClick={() => navigate("/")}
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "#2b2b2b",
                                    color: "#fff",
                                    borderRadius: "30px",
                                    padding: "8px 16px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "#444" },
                                }}
                            >
                                <IoArrowBackCircleSharp size={28} style={{ color: "#ff4b4b" }} />
                            </Button>

                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                indicatorColor="primary"
                                textColor="primary"
                                sx={{
                                    borderBottom: 1,
                                    borderColor: "divider",
                                    "& .MuiTab-root": {
                                        textTransform: "none",
                                        fontWeight: 500,
                                        minWidth: { xs: "120px", sm: "auto" },
                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                        px: { xs: 1, sm: 2 },
                                    },
                                }}
                            >

                                <Tab label="Gestión de Insumos" />
                                <Tab label="Registros de Ingreso/Egreso" />
                                <Tab label="Productos" />
                                <Tab label="Órdenes de Producción" />
                            </Tabs>
                        </Box>
                    )}

                    <TabPanel value={value} index={0}>
                        <Tabla />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <TablaRegistro />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <TablaProductos />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <TablaOrden />
                    </TabPanel>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
