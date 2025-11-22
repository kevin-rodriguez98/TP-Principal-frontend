import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { TiempoProduccionContext } from "../../../../Context/TiempoProduccionContext";
import { useContext } from "react";

export default function ModalTiempos({ open, onClose }: any) {

    const { tiempoProduccion } = useContext(TiempoProduccionContext)!;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}>
                Tiempo de Producción
            </DialogTitle>

            <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
                <Typography><b>Preparación:</b> {tiempoProduccion?.tiempoPreparacion ?? "-"} Min.</Typography>
                <Typography><b>Ciclos:</b> {tiempoProduccion?.tiempoCiclo ?? "-"}</Typography>
                <Typography><b>Tanda Máxima:</b> {tiempoProduccion?.cantidadMaximaTanda ?? "-"}</Typography>
                <Typography><b>Total:</b> {tiempoProduccion?.tiempoTotal ?? "-"} Min.</Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
