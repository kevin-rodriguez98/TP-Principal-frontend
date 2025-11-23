import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function ModalAgregarTiempo({
    open,
    onClose,
    nuevoTiempo,
    setNuevoTiempo,
    agregarTiempoProduccion,
    obtenerTiempoProduccionUnitario
}: any) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}>
                Registrar Tiempo de Producción
            </DialogTitle>

            <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
                <TextField
                    label="Código del Producto"
                    value={nuevoTiempo.codigoProducto}
                    disabled
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Tiempo de Preparación (min)"
                    type="number"
                    value={nuevoTiempo.tiempoPreparacion}
                    onChange={(e) =>
                        setNuevoTiempo({ ...nuevoTiempo, tiempoPreparacion: Number(e.target.value) })
                    }
                    fullWidth
                />

                <TextField
                    label="Tiempo de Ciclo (min)"
                    type="number"
                    value={nuevoTiempo.tiempoCiclo}
                    onChange={(e) =>
                        setNuevoTiempo({ ...nuevoTiempo, tiempoCiclo: Number(e.target.value) })
                    }
                    fullWidth
                />

                <TextField
                    label="Máximo por Tanda"
                    type="number"
                    value={nuevoTiempo.maximoTanda}
                    onChange={(e) =>
                        setNuevoTiempo({ ...nuevoTiempo, maximoTanda: Number(e.target.value) })
                    }
                    fullWidth
                />
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                <Button
                    variant="contained"
                    onClick={async () => {
                        if (!nuevoTiempo.codigoProducto) return;
                        await agregarTiempoProduccion(nuevoTiempo);
                        await obtenerTiempoProduccionUnitario(nuevoTiempo.codigoProducto);
                        onClose();
                    }}
                >
                    Guardar
                </Button>
                <Button onClick={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
}
