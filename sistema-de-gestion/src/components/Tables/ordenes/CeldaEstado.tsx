import { useState } from "react";
import {
    FormControl,
    Select,
    MenuItem,
    Modal,
    Box,
    TextField,
    Button,
} from "@mui/material";
import { estados, type Etapa, type ordenFinalizadaRequest } from "../../../Context/OrdenesContext";

interface Props {
    idOrden: number;
    estado: string;
    legajo: string;
    notificarEtapa: (etapa: Etapa) => Promise<void>;
    finalizarOrden: (orden: ordenFinalizadaRequest) => Promise<void>;
}

const colorEstado: Record<string, string> = {
    [estados.evaluacion]: "dodgerblue",
    [estados.enProduccion]: "gold",
    [estados.finalizada]: "limegreen",
    [estados.cancelada]: "crimson",
};

const styleModal = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#1e1e1e",
    borderRadius: "12px",
    boxShadow: 24,
    p: 3,
};

const CeldaEstado: React.FC<Props> = ({
    idOrden,
    estado,
    legajo,
    notificarEtapa,
    finalizarOrden,
}) => {

    const [openModal, setOpenModal] = useState(false);
    const [destino, setDestino] = useState("Almacen");
    const [cantidad, setCantidad] = useState("");

    const abrirModal = () => setOpenModal(true);
    const cerrarModal = () => {
        setOpenModal(false);
        setCantidad("");
        setDestino("Almacen");
    };

    const confirmarFinalizacion = async () => {
        if (!cantidad) return;

        await finalizarOrden({
            ordenId: idOrden,
            stockProducidoReal: Number(cantidad),
            destino,
            legajo,
        });

        cerrarModal();
    };

    const onChange = async (e: any) => {
        const nuevo = e.target.value;

        if (nuevo === estados.finalizada) {
            abrirModal();
            return;
        }

        if (nuevo === estados.enProduccion) {
            await notificarEtapa({
                idOrden,
                legajo,
                estado: nuevo,
                isEstado: true,
            });

            await notificarEtapa({
                idOrden,
                legajo,
                estado: "coccion",
                isEstado: false,
            });
            return;
        }

        await notificarEtapa({
            idOrden,
            legajo,
            estado: nuevo,
            isEstado: true,
        });
    };

    return (
        <>
            <FormControl variant="standard" sx={{ minWidth: 160 }}>
                <Select
                    value={estado}
                    onChange={onChange}
                    disabled={estado === estados.finalizada || estado === estados.cancelada}
                    sx={{
                        background: "#1e1e1e",
                        color: colorEstado[estado],
                        fontWeight: 700,
                        px: 1.2,
                        borderRadius: "6px",
                        border: `1px solid ${colorEstado[estado]}`,
                        "& .MuiSvgIcon-root": {
                            color: colorEstado[estado],
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: { backgroundColor: "#222", borderRadius: "10px" },
                        },
                    }}
                >
                    <MenuItem value={estados.evaluacion} sx={{ color: "dodgerblue" }}>
                        Evaluación
                    </MenuItem>

                    <MenuItem value={estados.enProduccion} sx={{ color: "gold" }}>
                        En Producción
                    </MenuItem>

                    <MenuItem value={estados.cancelada} sx={{ color: "crimson" }}>
                        Cancelada
                    </MenuItem>

                    <MenuItem value={estados.finalizada} sx={{ color: "limegreen" }}>
                        Finalizada
                    </MenuItem>
                </Select>
            </FormControl>

            {/* MODAL FINALIZAR ORDEN */}
            <Modal open={openModal} onClose={cerrarModal}>
                <Box sx={styleModal}>
                    <h3 style={{ marginBottom: "15px" }}>Finalizar Orden</h3>

                    <TextField
                        fullWidth
                        select
                        label="Destino"
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        sx={{
                            mb: 2,
                            label: { color: "#aaa" },
                            "& .MuiSelect-select": { color: "white" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#555" },
                                "&:hover fieldset": { borderColor: "#888" },
                            },
                        }}
                    >
                        <MenuItem value="Almacen">Almacén</MenuItem>
                        <MenuItem value="Venta directa">Venta directa</MenuItem>
                        <MenuItem value="Descarte">Descarte</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        type="number"
                        label="Cantidad producida"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        sx={{
                            mb: 3,
                            input: { color: "white" },
                            label: { color: "#aaa" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#555" },
                                "&:hover fieldset": { borderColor: "#888" },
                            },
                        }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <Button variant="outlined" color="error" onClick={cerrarModal}>
                            Cancelar
                        </Button>

                        <Button variant="contained" onClick={confirmarFinalizacion}>
                            Confirmar
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default CeldaEstado;
