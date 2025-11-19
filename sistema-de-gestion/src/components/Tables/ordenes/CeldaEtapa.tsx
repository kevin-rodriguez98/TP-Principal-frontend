import { useState } from "react";
import { FormControl, MenuItem, Select, IconButton, Modal, Box, TextField } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { etapas_prduccion } from "../../../Context/OrdenesContext";

interface Props {
    idOrden: number;
    etapa: string;
    legajo: string;
    notificarEtapa: (req: {
        idOrden: number;
        legajo: string;
        estado: string;
        isEstado: boolean;
    }) => Promise<void>;
    agregarNota: (id: number, nota: string) => Promise<void>;
}

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

const CeldaEtapa: React.FC<Props> = ({
    idOrden,
    etapa,
    legajo,
    notificarEtapa,
    agregarNota
}) => {

    const [open, setOpen] = useState(false);
    const [nota, setNota] = useState("");

    const abrirModal = () => setOpen(true);
    const cerrarModal = () => {
        setOpen(false);
        setNota("");
    };

    const guardarNota = async () => {
        if (nota.trim().length === 0) return;
        await agregarNota(idOrden, nota);
        cerrarModal();
    };

    const onChange = async (e: any) => {
        const nuevo = e.target.value;

        await notificarEtapa({
            idOrden,
            legajo,
            estado: nuevo,
            isEstado: false,
        });
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                {/* SELECT DE ETAPA */}
                <FormControl variant="standard" sx={{ minWidth: 160 }}>
                    <Select
                        value={etapa}
                        onChange={onChange}
                        sx={{
                            background: "#1e1e1e",
                            fontWeight: 700,
                            px: 1.2,
                            borderRadius: "6px",
                            border: `1px solid`,
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: { backgroundColor: "#222", borderRadius: "10px" },
                            },
                        }}
                    >
                        <MenuItem value={etapas_prduccion.coccion} sx={{ color: "dodgerblue" }}>
                            Cocción
                        </MenuItem>

                        <MenuItem value={etapas_prduccion.pasteurizacion} sx={{ color: "gold" }}>
                            Pasteurización
                        </MenuItem>

                        <MenuItem value={etapas_prduccion.enfriado} sx={{ color: "crimson" }}>
                            Enfriado
                        </MenuItem>

                        <MenuItem value={etapas_prduccion.envasado} sx={{ color: "limegreen" }}>
                            Envasado
                        </MenuItem>

                        <MenuItem value={etapas_prduccion.almacenamiento} sx={{ color: "limegreen" }}>
                            Almacenamiento
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* ÍCONO PARA AGREGAR NOTA */}
                <IconButton onClick={abrirModal} sx={{ p: 0 }}>
                    <NoteAddIcon fontSize="small" sx={{ color: "limegreen" }} />
                </IconButton>

            </div>

            {/* MODAL PARA CARGAR LA NOTA */}
            <Modal open={open} onClose={cerrarModal}>
                <Box sx={styleModal}>
                    <h3 style={{ marginBottom: "10px" }}>Agregar nota</h3>

                    <TextField
                        multiline
                        fullWidth
                        minRows={3}
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        placeholder="Escribe la nota..."
                        sx={{
                            textarea: { color: "white" },
                            input: { color: "white" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#555" },
                                "&:hover fieldset": { borderColor: "#888" },
                            },
                        }}
                    />

                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                            onClick={cerrarModal}
                            style={{
                                background: "transparent",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                border: "1px solid crimson",
                                color: "crimson",
                                cursor: "pointer"
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={guardarNota}
                            style={{
                                background: "limegreen",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                border: "none",
                                color: "black",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Guardar
                        </button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default CeldaEtapa;
