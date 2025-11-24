import { useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from "@mui/material";

import { type Locacion } from "../../../../Context/InsumoContext"
import { ESTANTES } from "../../../estaticos/MapaAlmacen";

interface Props {
    open: boolean;
    onClose: () => void;
    locacion: Locacion;
    onChange: (field: keyof Locacion, value: string) => void;
    onConfirm: () => void;
}

export default function ModalLocacionInsumo({
    open,
    onClose,
    locacion,
    onChange,
    onConfirm
}: Props) {


    const estantesFiltrados = useMemo(() => {
        return ESTANTES.filter((e) => e.sectorId === locacion.sector);
    }, [locacion.sector]);

    const posicionesKeys = useMemo(() => {
        const posiciones =
            estantesFiltrados.find((e) => e.id === locacion.estante)?.posiciones || {};
        return Object.keys(posiciones);
    }, [estantesFiltrados, locacion.estante]);


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                Ubicación del Insumo
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                    padding: 2,
                    width: "480px",
                }}
            >
                {/* DEPÓSITO */}
                <TextField
                    label="Depósito"
                    value="Depósito Central"
                    disabled= {true}
                />

                {/* SECTOR */}
                <TextField
                    select
                    label="Sector"
                    value={locacion.sector}
                    onChange={(e) => {
                        const value = e.target.value;
                        onChange("sector", value);
                        onChange("estante", "");   // reset
                        onChange("posicion", "");  // reset
                    }}
                >
                    <MenuItem value="recepcion">Recepción MP</MenuItem>
                    <MenuItem value="camara-mp">Cámara MP (Frío)</MenuItem>
                    <MenuItem value="camara-pt">Prod. Terminados</MenuItem>
                    <MenuItem value="packaging">Depósito Packaging</MenuItem>
                    <MenuItem value="insumos-secos">Depósito Insumos Secos</MenuItem>
                    <MenuItem value="despacho">Área Despacho</MenuItem>
                </TextField>

                {/* ESTANTE (dinámico según sector) */}
                <TextField
                    select
                    label="Estante"
                    value={locacion.estante}
                    disabled={estantesFiltrados.length === 0}
                    onChange={(e) => {
                        onChange("estante", e.target.value);
                        onChange("posicion", ""); // reset posición
                    }}
                >
                    {estantesFiltrados.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                            {e.id.toUpperCase()} (Sector {e.sectorId})
                        </MenuItem>
                    ))}
                </TextField>

                {/* POSICIÓN (dinámico según estante) */}
                <TextField
                    select
                    label="Posición"
                    value={locacion.posicion}
                    disabled={posicionesKeys.length === 0}
                    onChange={(e) => onChange("posicion", e.target.value)}
                >
                    {posicionesKeys.map((pos) => (
                        <MenuItem key={pos} value={pos}>
                            {pos}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                    Cancelar
                </Button>

                <Button variant="contained" onClick={onConfirm}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
