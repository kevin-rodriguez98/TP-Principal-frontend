import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { RecetaContext, type Receta } from "../../../../Context/RecetaContext";
import { InsumoContext } from "../../../../Context/InsumoContext";

export default function AddReceta({
    open,
    onClose,
    productoInfo
}: any) {


    const [nuevoInsumo, setNuevoInsumo] = useState<Receta>({
        codigoInsumo: "",
        nombreInsumo: "",
        cantidadNecesaria: 1,
        unidad: ""
    });
    const { insumos } = useContext(InsumoContext)!;
    const { obtenerInsumosNecesarios, agregarInsumoAReceta } = useContext(RecetaContext)!;



    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}>
                Agregar Insumo a Receta
            </DialogTitle>

            <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
                <TextField
                    label="Código del Producto"
                    value={productoInfo?.codigo}
                    disabled
                    fullWidth
                    sx={{ mt: 1 }}
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    select
                    value={nuevoInsumo.codigoInsumo}
                    onChange={(e) => {
                        const codigo = e.target.value;
                        const insumoSeleccionado = insumos.find((i: any) => i.codigo === codigo);
                        setNuevoInsumo({
                            ...nuevoInsumo,
                            codigoInsumo: codigo,
                            nombreInsumo: insumoSeleccionado?.nombre ?? "",
                        });
                    }}
                    SelectProps={{ native: true }}
                    fullWidth
                >
                    <option value="">Seleccione un insumo</option>
                    {insumos.map((i: any) => (
                        <option key={i.codigo} value={i.codigo}>
                            {i.codigo + " - " + i.nombre + " - " + i.marca}
                        </option>
                    ))}
                </TextField>

                <TextField
                    label="Cantidad Necesaria"
                    type="number"
                    value={nuevoInsumo.cantidadNecesaria}
                    onChange={(e) =>
                        setNuevoInsumo({
                            ...nuevoInsumo,
                            cantidadNecesaria: Number(e.target.value),
                        })
                    }
                    inputProps={{ step: "0.01" }}  
                    fullWidth
                />

                <TextField
                    label="Unidad"
                    disabled
                    value={productoInfo?.unidad}
                    fullWidth
                />
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                <Button
                    variant="contained"
                    onClick={async () => {
                        await agregarInsumoAReceta(productoInfo?.codigo, nuevoInsumo);
                        await obtenerInsumosNecesarios(productoInfo?.codigo, productoInfo?.stock);
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
