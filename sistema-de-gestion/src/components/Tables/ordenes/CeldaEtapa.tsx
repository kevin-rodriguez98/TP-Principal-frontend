import React, { useState } from "react";
import {
    FormControl,
    Select,
    MenuItem,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { ESTADOS } from "./TablaOrden"; // ajustá la ruta según tu estructura

interface CeldaEtapaProps {
    row: any;
    agregarNota: (id: number, nota: string) => Promise<void>;
    notificarEtapa: (id: number, nuevaEtapa: string) => Promise<void>;
}

const CeldaEtapa: React.FC<CeldaEtapaProps> = ({ row, agregarNota, notificarEtapa }) => {
    const [open, setOpen] = useState(false);
    const [nota, setNota] = useState("");
    const [loading, setLoading] = useState(false);

    const estado = row.original.estado;
    const estaEnProduccion = estado === ESTADOS.enProduccion;
    const etapaActual = row.original.etapa || "Cocción";

    const handleCambiarEtapa = async (nuevaEtapa: string) => {
        await notificarEtapa(row.original.id, nuevaEtapa);
    };

    const handleGuardarNota = async () => {
        if (!nota.trim()) return;
        setLoading(true);
        try {
            await agregarNota(row.original.id, nota);
            setOpen(false);
            // setNota("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FormControl
                variant="standard"
                sx={{
                    minWidth: 100,
                    background: "#2b2b2b",
                    borderRadius: "6px",
                    px: 1,
                    opacity: estaEnProduccion ? 1 : 0.5,
                }}
            >
                <Select
                    value={etapaActual}
                    onChange={(e) => handleCambiarEtapa(e.target.value)}
                    sx={{
                        color: "#fff",
                        "& .MuiSelect-icon": { color: "#15a017ff" },
                    }}
                    disabled={!estaEnProduccion}
                >
                    <MenuItem value="Cocción">Cocción</MenuItem>
                    <MenuItem value="Enfriado">Enfriado</MenuItem>
                    <MenuItem value="Almacenamiento">Almacenamiento</MenuItem>
                    <MenuItem value="Envasado">Envasado</MenuItem>
                </Select>
            </FormControl>

            <Tooltip title="Agregar nota">
                <IconButton
                    size="small"
                    onClick={() => setOpen(true)}
                    sx={{ color: "#15a017ff" }}
                    disabled={!estaEnProduccion}
                >
                    <NoteAddIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: "#1e1e1e",
                        color: "#f1f1f1",
                        width: "420px",
                        borderRadius: 3,
                        p: 2,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                    Nota de la etapa {etapaActual}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        minRows={3}
                        variant="filled"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        label="Escribe una nota"
                        InputProps={{
                            style: {
                                color: "#fff",
                                background: "#2b2b2b",
                            },
                        }}
                        InputLabelProps={{
                            style: { color: "#bbb" },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                        sx={{ color: "#ccc", textTransform: "none" }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleGuardarNota}
                        variant="contained"
                        sx={{
                            backgroundColor: "#15a017ff",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#178c15" },
                        }}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CeldaEtapa;
