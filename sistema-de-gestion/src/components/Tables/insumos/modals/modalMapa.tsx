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
                    maxWidth: "650px",
                    width: "95%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                },
            }}
        >
            {/* Título con botón de cerrar */}
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
                    width: "100%",
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
