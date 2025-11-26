import React, { useState, useEffect, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Tabs, Tab, Typography, CssBaseline, Paper, Button } from "@mui/material";
import { darkScrollbar } from "@mui/material";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { Select, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import Tabla from "./insumos/Tabla";
import TablaOrden from "./ordenes/TablaOrden";
import TablaRegistro from "./registros/TablaRegistro";
import TablaProductos from "./Productos/TablaProductos";
import { FiBox, FiFileText, FiPackage, FiCpu } from "react-icons/fi";
import { AuthContext } from "../../Context/AuthContext";




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
        primary: { main: "#8c52ff81" },
        secondary: { main: "#b13c7e63" },
        background: {
            default: "#0e1217",
            paper: "#111827",
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

export default function PanelGeneral({ }) {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext)!;

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
            <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", backgroundColor: "#0e1217" }}>
                <Paper elevation={3} sx={{ mx: 4, mt: 4, borderRadius: 2 }}>
                    {isMobile ? (
                        <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
                            <Button
                                onClick={() => navigate("/menu")}
                                variant="contained"
                                sx={{
                                    backgroundColor: "#111827",
                                    color: "#fff",
                                    borderRadius: "30px",
                                    padding: "6px 12px",
                                    minWidth: "auto",
                                    "&:hover": { backgroundColor: "#0e1217" },
                                }}
                            >
                                <IoArrowBackCircleSharp size={24} style={{ color: "#8c52ff" }} />
                            </Button>
                            <Select
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                fullWidth
                                sx={{
                                    backgroundColor: "#111827",
                                    color: "#fff",
                                    borderRadius: "10px",
                                    "& .MuiSvgIcon-root": { color: "#fff" },
                                }}
                            >
                                <MenuItem value={0}>
                                    <FiBox style={{ marginRight: 8 }} /> Gestión de Insumos
                                </MenuItem>

                                <MenuItem value={1}>
                                    <FiFileText style={{ marginRight: 8 }} /> Registros
                                </MenuItem>

                                <MenuItem value={2}>
                                    <FiPackage style={{ marginRight: 8 }} /> Productos
                                </MenuItem>

                                <MenuItem value={3}>
                                    <FiCpu style={{ marginRight: 8 }} /> Órdenes de Producción
                                </MenuItem>
                            </Select>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2 }}>
                            <Button
                                onClick={() => navigate("/menu")}
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "#0e1217",
                                    color: "#fff",
                                    borderRadius: "30px",
                                    padding: "8px 16px",
                                    textTransform: "none",
                                    "&:hover": { backgroundColor: "#1c1922ff" },
                                }}
                            >
                                <IoArrowBackCircleSharp size={28} style={{ color: "#8c52ff" }} />
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
                                <Tab
                                    icon={<FiBox size={20} />}
                                    iconPosition="start"
                                    label="Gestión de Insumos"
                                />
                                <Tab
                                    icon={<FiFileText size={20} />}
                                    iconPosition="start"
                                    label="Registros"
                                />
                                <Tab
                                    icon={<FiPackage size={20} />}
                                    iconPosition="start"
                                    label="Productos"
                                />
                                <Tab
                                    icon={<FiCpu size={20} />}
                                    iconPosition="start"
                                    label="Órdenes de Producción"
                                />
                            </Tabs>
                            <Box
                                sx={{
                                    marginLeft: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    backgroundColor: "#141120ff",
                                    borderRadius: "12px",
                                    padding: "6px 12px",
                                    boxShadow: "0 0 10px rgba(17, 14, 25, 0.3)",
                                }}
                            >
                                {user ? (
                                    <>
                                        <Box
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: "50%",
                                                backgroundColor: "#311e55",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {user.nombre?.charAt(0).toUpperCase()}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: "0.85rem", color: "gray" }}>
                                                Sesión activa
                                            </Typography>
                                            <Typography sx={{ fontSize: "0.95rem", fontWeight: "bold", color: "green" }}>
                                                {user.nombre}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="error"
                                            onClick={logout}
                                            sx={{
                                                textTransform: "none",
                                                borderRadius: "8px",
                                                padding: "4px 10px",
                                            }}
                                        >
                                            Cerrar
                                        </Button>
                                    </>
                                ) : (
                                    <Typography color="text.secondary">⚪ Sin usuario autenticado</Typography>
                                )}
                            </Box>
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
