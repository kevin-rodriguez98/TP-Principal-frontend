import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { TiempoProduccionContext, type TiempoProduccion } from "../../../../Context/TiempoProduccionContext";

export default function ModalTiempoProduccion({
    open,
    onClose,
    productoInfo,
}: any) {

    const { tiempoProduccion, agregarTiempoProduccion, obtenerTiempoProduccionUnitario } =
        useContext(TiempoProduccionContext)!;
    const [editMode, setEditMode] = useState(false);

    const [form, setForm] = useState<TiempoProduccion>({
        codigoProducto: "",
        tiempoPreparacion: 0,
        tiempoCiclo: 0,
        maximoTanda: 0,
    });

    // Cargar datos cuando se abre
    useEffect(() => {
        if (!open) return;

        setEditMode(false); // siempre inicia en modo visualización

        setForm({
            codigoProducto: productoInfo?.codigo,
            tiempoPreparacion: tiempoProduccion?.tiempoPreparacion ?? 0,
            tiempoCiclo: tiempoProduccion?.tiempoCiclo ?? 0,
            maximoTanda: tiempoProduccion?.cantidadMaximaTanda ?? 0,
        });

    }, [open, productoInfo, tiempoProduccion]);


    const handleSave = async () => {
        await agregarTiempoProduccion(productoInfo?.codigo, form);
        await obtenerTiempoProduccionUnitario(productoInfo?.codigo);
        setEditMode(false); // vuelve al modo ver
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}>
                Tiempo de Producción
            </DialogTitle>

            <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>

                {/* --- MODO VER --- */}
                {!editMode && (
                    <>
                        <Typography><b>Preparación:</b> {tiempoProduccion?.tiempoPreparacion ?? "-"} Min.</Typography>
                        <Typography><b>Ciclos:</b> {tiempoProduccion?.tiempoCiclo ?? "-"}</Typography>
                        <Typography><b>Tanda Máxima:</b> {tiempoProduccion?.cantidadMaximaTanda ?? "-"}</Typography>
                        <Typography><b>Total:</b> {tiempoProduccion?.tiempoTotal ?? "-"} Min.</Typography>
                    </>
                )}

                {/* --- MODO EDITAR --- */}
                {editMode && (
                    <>
                        <TextField
                            label="Código del Producto"
                            value={form.codigoProducto}
                            disabled
                            fullWidth
                            sx={{ mt: 1 }}

                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Tiempo de Preparación (minutos)"
                            type="number"
                            inputProps={{ step: "0.01", min: 0 }}
                            value={form.tiempoPreparacion}
                            onChange={(e) => setForm({ ...form, tiempoPreparacion: Number(e.target.value) })}
                            fullWidth
                        />

                        <TextField
                            label="Tiempo de Ciclo (minutos)"
                            type="number"
                            inputProps={{ step: "0.01", min: 0 }}
                            value={form.tiempoCiclo}
                            onChange={(e) => setForm({ ...form, tiempoCiclo: Number(e.target.value) })}
                            fullWidth
                        />

                        <TextField
                            label="Máximo por Tanda"
                            type="number"
                            inputProps={{ step: "0.01", min: 0 }}
                            value={form.maximoTanda}
                            onChange={(e) => setForm({ ...form, maximoTanda: Number(e.target.value) })}
                            fullWidth
                        />
                    </>
                )}

            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>

                {/* Si NO está editando → mostrar botón EDITAR */}
                {!editMode && (
                    <Button variant="contained" onClick={() => setEditMode(true)}>
                        Editar
                    </Button>
                )}

                {/* Si está editando → mostrar GUARDAR + CANCELAR */}
                {editMode && (
                    <>
                        <Button variant="contained" onClick={handleSave}>
                            Guardar
                        </Button>
                        <Button variant="outlined" onClick={() => setEditMode(false)}>
                            Cancelar
                        </Button>
                    </>
                )}

                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
