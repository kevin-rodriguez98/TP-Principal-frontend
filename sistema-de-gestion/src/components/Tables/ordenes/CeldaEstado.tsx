import { useState } from "react";
import { FormControl, Select, MenuItem, Modal, Box, TextField, Button } from "@mui/material";
import { estados, type Etapa, type ordenFinalizadaRequest } from "../../../Context/OrdenesContext";
import { PERMISOS } from "../../../Context/PanelContext";
import { useUsuarios } from "../../../Context/UsuarioContext";
interface Props {
    idOrden: number;
    estado: (typeof estados)[keyof typeof estados];
    legajo: string;
    notificarEtapa: (etapa: Etapa) => Promise<void>;
    finalizarOrden: (orden: ordenFinalizadaRequest) => Promise<void>;
}

const colorEstado: Record<string, string> = {
    [estados.evaluacion]: "#b062ce",
    [estados.enProduccion]: "#f1c40f",
    [estados.finalizada]: "#b13c7e",
    [estados.cancelada]: "#d88346",
};

const styleModal = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#111827",
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
    const {usuario} = useUsuarios();
    const rol = usuario?.rol?.toLowerCase() as keyof typeof PERMISOS | undefined;
    const permisos = rol ? PERMISOS[rol] : PERMISOS.operario;

    const puedeCambiarEstado = permisos?.cambiarEstadoOrden;

    const abrirModal = () => {
        if (!puedeCambiarEstado) return;
        setOpenModal(true);
    };

    const cerrarModal = () => {
        setOpenModal(false);
        setCantidad("");
        setDestino("Almacen");
    };

    const confirmarFinalizacion = async () => {
        if (!puedeCambiarEstado) return;

        if (!cantidad || Number(cantidad) <= 0) {
            alert("Ingrese una cantidad válida");
            return;
        }

        await finalizarOrden({
            ordenId: idOrden,
            stockProducidoReal: Number(cantidad),
            destino,
            legajo,
        });

        cerrarModal();
    };

    const onChange = async (e: any) => {
        if (!puedeCambiarEstado) return; // ❌ sin permiso no cambia

        const nuevo = e.target.value;

        // Validaciones según estado actual
        if (estado === estados.evaluacion && ![estados.enProduccion, estados.cancelada].includes(nuevo)) return;
        if (estado === estados.enProduccion && ![estados.finalizada, estados.cancelada].includes(nuevo)) return;

        if (nuevo === estados.finalizada) {
            abrirModal();
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
                    disabled={!puedeCambiarEstado} // 👈 permiso aplicado
                    sx={{
                        background: "#111827",
                        color: colorEstado[estado],
                        fontWeight: 700,
                        px: 1.2,
                        borderRadius: "6px",
                        border: `1px solid ${colorEstado[estado]}`,
                        "& .MuiSvgIcon-root": { color: colorEstado[estado] },
                        opacity: !puedeCambiarEstado ? 0.5 : 1,
                    }}
                    MenuProps={{
                        PaperProps: { sx: { backgroundColor: "#311e55", borderRadius: "10px" } },
                    }}
                >
                    <MenuItem
                        value={estados.evaluacion}
                        disabled={estado !== estados.cancelada}
                    >
                        Evaluación
                    </MenuItem>

                    <MenuItem
                        value={estados.enProduccion}
                        disabled={estado !== estados.evaluacion}
                    >
                        En Producción
                    </MenuItem>

                    <MenuItem
                        value={estados.finalizada}
                        disabled={estado !== estados.enProduccion}
                    >
                        Finalizada
                    </MenuItem>

                    <MenuItem
                        value={estados.cancelada}
                        disabled={estado === estados.finalizada}
                    >
                        Cancelada
                    </MenuItem>
                </Select>
            </FormControl>

            {/* MODAL FINALIZAR */}
            <Modal open={openModal} onClose={cerrarModal}>
                <Box sx={styleModal}>
                    <h3 style={{ marginBottom: "15px" }}>Finalizar Orden</h3>

                    <TextField
                        fullWidth
                        select
                        label="Destino"
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                        disabled={!puedeCambiarEstado}
                        sx={{
                            mb: 2,
                            label: { color: "#aaa" },
                            "& .MuiSelect-select": { color: "white" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#311e55" },
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
                        disabled={!puedeCambiarEstado}
                        sx={{
                            mb: 3,
                            input: { color: "white" },
                            label: { color: "#aaa" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#311e55" },
                                "&:hover fieldset": { borderColor: "#888" },
                            },
                        }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <Button variant="outlined" color="error" onClick={cerrarModal}>
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={confirmarFinalizacion}
                            disabled={!puedeCambiarEstado}
                        >
                            Confirmar
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default CeldaEstado;
