import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useContext, useState } from "react";
import AddReceta from "./AddReceta";
import ModalTiempoProduccion from "./ModalTiempoProduccion";
import { RecetaContext } from "../../../../Context/RecetaContext";
import { TiempoProduccionContext } from "../../../../Context/TiempoProduccionContext";

export default function ModalReceta({
    open,
    onClose,
    producto,
}: any) {

    const { insumosProducto } = useContext(RecetaContext)!;
    const { obtenerTiempoProduccionUnitario } = useContext(TiempoProduccionContext)!;

    const [openAgregar, setOpenAgregar] = useState(false);
    const [openModalTiempos, setOpenModalTiempos] = useState(false);

    // 👉 Nuevo estado para resaltar el insumo agregado
    const [highlightId, setHighlightId] = useState<string | null>(null);

    const handleNuevoInsumo = (codigoInsumo: string) => {
        setHighlightId(codigoInsumo);

        // Quitar highlight después de 1.5 segundos
        setTimeout(() => setHighlightId(null), 1500);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

                <DialogTitle
                    sx={{
                        fontWeight: "bold",
                        position: "relative",
                        bgcolor: "#1f1f1f",
                        color: "white",
                        pb: 1
                    }}
                >
                    🧾 Receta de {producto?.nombre}

                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "white"
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                {/* 📌 LISTA SCROLLEABLE */}
                <DialogContent
                    dividers
                    sx={{
                        bgcolor: "#1f1f1f",
                        color: "white",
                        maxHeight: "300px",    // 👈 altura máxima visible
                        overflowY: "auto"       // 👈 scroll solo aquí
                    }}
                >
                    {insumosProducto.length === 0 ? (
                        <Typography>No hay receta disponible.</Typography>
                    ) : (
                        <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
                            {insumosProducto.map((insumo: any, index: number) => (
                                <li
                                    key={index}
                                    style={{
                                        marginBottom: "8px",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        transition: "background-color 0.5s",
                                        backgroundColor:
                                            highlightId === insumo.codigoInsumo
                                                ? "rgba(0, 255, 100, 0.25)"
                                                : "transparent"
                                    }}
                                >
                                    <Typography variant="body2">
                                        <strong>{insumo.nombreInsumo}</strong> — Cantidad:{" "}
                                        {insumo.cantidadNecesaria + " " + insumo.unidad}
                                    </Typography>
                                </li>
                            ))}
                        </Box>
                    )}
                </DialogContent>

                {/* 📌 BOTONES FIJOS — SIEMPRE VISIBLES */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        justifyContent: "center",
                        bgcolor: "#1f1f1f",
                        borderTop: "1px solid #333",
                    }}
                >
                    <Button variant="contained" onClick={() => setOpenAgregar(true)}>
                        Agregar insumo
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<AccessTimeIcon />}
                        onClick={async () => {
                            await obtenerTiempoProduccionUnitario(producto?.codigo);
                            setOpenModalTiempos(true);
                        }}
                    >
                        Ver tiempos
                    </Button>
                </Box>

            </Dialog>


            {/* Modal para agregar receta */}
            <AddReceta
                open={openAgregar}
                onClose={() => setOpenAgregar(false)}
                productoInfo={producto}
                onAgregado={handleNuevoInsumo}   // 👈 agregamos esta prop
            />

            {/* Modal de tiempos */}
            <ModalTiempoProduccion
                open={openModalTiempos}
                onClose={() => setOpenModalTiempos(false)}
                productoInfo={producto}
            />
        </>
    );
}
