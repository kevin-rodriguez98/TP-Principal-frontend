import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";


export default function ModalInfoProducto({ open, onClose, productoInfo }: any) {


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}>
                Información del Producto
            </DialogTitle>

            <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
                {productoInfo && (
                    <>
                        <Typography><b>Código:</b> {productoInfo.codigo}</Typography>
                        <Typography><b>Nombre:</b> {productoInfo.nombre}</Typography>
                        <Typography><b>Categoría:</b> {productoInfo.categoria}</Typography>
                        <Typography><b>Línea:</b> {productoInfo.linea}</Typography>
                        <Typography><b>Presentación:</b> {productoInfo.presentacion} {productoInfo.unidad}</Typography>
                        <Typography><b>Stock:</b> {productoInfo.stock}</Typography>
                        <Typography><b>Fecha Creación:</b> {productoInfo.fechaCreacion}</Typography>
                        <Typography>
                            <b>Responsable:</b> {productoInfo.legajo} - {productoInfo.responsableApellido} {productoInfo.responsableNombre}
                        </Typography>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center" }}>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
}
