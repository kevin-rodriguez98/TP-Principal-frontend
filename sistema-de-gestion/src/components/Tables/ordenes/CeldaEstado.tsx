import React, { useState } from "react";
import {
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { ESTADOS, COLORES_ESTADOS } from "./TablaOrden"; // Ajustá la ruta según donde tengas tus constantes

interface CeldaEstadoProps {
    row: any;
    marcarEnProduccion: (id: number, codigoProducto: string) => Promise<void>;
    finalizarOrden: (id: number, stockProducidoReal: number, destino: string) => Promise<void>;
    cancelarOrden: (id: number) => Promise<void>;
}

const CeldaEstado: React.FC<CeldaEstadoProps> = ({
    row,
    marcarEnProduccion,
    finalizarOrden,
    cancelarOrden,
}) => {
    const [estado, setEstado] = useState(row.original.estado || ESTADOS.evaluacion);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [finalizarOpen, setFinalizarOpen] = useState(false);
    const [nuevoEstado, setNuevoEstado] = useState<string | null>(null);
    const [stockReal, setStockReal] = useState<number>(0);
    const [destino, setDestino] = useState<string>("Depósito Central");

    const bg = COLORES_ESTADOS[estado] || "gray";
    const { id, codigoProducto } = row.original;

    // Validaciones
    const puedeMarcarProduccion =
        estado !== ESTADOS.enProduccion && estado !== ESTADOS.finalizada && estado !== ESTADOS.cancelada;
    const puedeFinalizar =
        estado !== ESTADOS.finalizada && estado !== ESTADOS.cancelada && estado !== ESTADOS.evaluacion;
    const puedeCancelar =
        estado !== ESTADOS.finalizada && estado !== ESTADOS.cancelada && estado !== ESTADOS.enProduccion;

    const handleCambiarEstado = (nuevo: string) => {
        setNuevoEstado(nuevo);
        setConfirmOpen(true);
    };

    const confirmarCambio = async () => {
        if (!nuevoEstado) return;
        setConfirmOpen(false);

        try {
            switch (nuevoEstado) {
                case ESTADOS.enProduccion:
                    if (puedeMarcarProduccion) await marcarEnProduccion(Number(id), codigoProducto);
                    setEstado(ESTADOS.enProduccion);
                    break;

                case ESTADOS.finalizada:
                    if (puedeFinalizar) setFinalizarOpen(true);
                    break;

                case ESTADOS.cancelada:
                    if (puedeCancelar) await cancelarOrden(Number(id));
                    setEstado(ESTADOS.cancelada);
                    break;
            }
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
        }
    };

    const confirmarFinalizacion = async () => {
        try {
            await finalizarOrden(Number(id), stockReal, destino);
            setEstado(ESTADOS.finalizada);
            setFinalizarOpen(false);
        } catch (error) {
            console.error("Error al finalizar la orden:", error);
        }
    };

    return (
        <>
            <FormControl
                variant="standard"
                sx={{
                    minWidth: 160,
                    background: bg,
                    color: bg === "gold" ? "black" : "white",
                    borderRadius: "8px",
                    px: 1.5,
                    py: 0.5,
                }}
            >
                <Select
                    value={estado}
                    onChange={(e) => handleCambiarEstado(e.target.value)}
                    sx={{
                        color: "inherit",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        "& .MuiSelect-icon": { color: "inherit" },
                    }}
                >
                    <MenuItem value={ESTADOS.evaluacion}>Evaluación🔍</MenuItem>
                    <MenuItem value={ESTADOS.enProduccion} disabled={!puedeMarcarProduccion}>
                        En Producción⚙️
                    </MenuItem>
                    <MenuItem value={ESTADOS.finalizada} disabled={!puedeFinalizar}>
                        Finalizada✅
                    </MenuItem>
                    <MenuItem value={ESTADOS.cancelada} disabled={!puedeCancelar}>
                        Cancelada❌
                    </MenuItem>
                </Select>
            </FormControl>

            {/* Modal de confirmación general */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirmar cambio</DialogTitle>
                <DialogContent>
                    ¿Seguro que deseas cambiar el estado a{" "}
                    <strong style={{ color: COLORES_ESTADOS[nuevoEstado || ""] }}>{nuevoEstado}</strong>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
                    <Button onClick={confirmarCambio} variant="contained">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de finalización */}
            <Dialog open={finalizarOpen} onClose={() => setFinalizarOpen(false)}>
                <DialogTitle>Finalizar orden de producción</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Stock producido real"
                        type="number"
                        fullWidth
                        value={stockReal}
                        onChange={(e) => setStockReal(Number(e.target.value))}
                    />
                    <TextField
                        label="Destino de almacenamiento"
                        fullWidth
                        value={destino}
                        onChange={(e) => setDestino(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFinalizarOpen(false)}>Cancelar</Button>
                    <Button
                        onClick={confirmarFinalizacion}
                        variant="contained"
                        disabled={!stockReal || destino.trim() === ""}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CeldaEstado;
