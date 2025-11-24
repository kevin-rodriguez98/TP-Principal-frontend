import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MapaAlmacenPro from "../../../estaticos/MapaAlmacen";
import { type Insumo } from "../../../../Context/InsumoContext";

interface Props {
    open: boolean;
    onClose: () => void;
    insumo: Insumo | null;
}

export default function ModalMapaAlmacen({ open, onClose, insumo }: Props) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            PaperProps={{
                sx: {
                    padding: 2,
                    borderRadius: 3,
                    width: "90vw",          // ancho grande
                    height: "80vh",         // más bajo
                    maxWidth: "1100px",     // límite
                    maxHeight: "650px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden"
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: "bold",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 1.5,
                }}
            >
                Ubicación de: {insumo?.nombre}
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",       // ocupa el modal horizontal
                }}
            >
                {insumo && (
                    <MapaAlmacenPro
                        codigo={insumo.codigo}
                        sector={insumo.locacion.sector}
                        estante={insumo.locacion.estante}
                        posicion={insumo.locacion.posicion}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
