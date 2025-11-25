import { Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
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
                    width: "70vw",
                    height: "80vh",
                    maxWidth: "1100px",
                    maxHeight: "650px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",   // necesario para posicionar el botón
                    overflow: "hidden"
                },
            }}
        >

            {/* Botón cerrar alineado a la derecha sin afectar el título */}
            <IconButton
                onClick={onClose}
                sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 10,
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogTitle
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                Mapa de Depósito Central
            </DialogTitle>
{insumo && (
    <div
        style={{
            width: "100%",
            padding: "10px 0",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
        }}
    >
        {[
            { label: "Código", value: insumo.codigo },
            { label: "Nombre", value: insumo.nombre },
            { label: "Sector", value: insumo.locacion.sector },
            { label: "Estante", value: insumo.locacion.estante },
            { label: "Posición", value: insumo.locacion.posicion },
        ].map((item) => (
            <div
                key={item.label}
                style={{
                    padding: "6px 12px",
                    background: "#1e1e1e",
                    color: "#e0e0e0",
                    borderRadius: "8px",
                    border: "1px solid #333",
                    fontSize: "13px",
                    fontWeight: 500,
                }}
            >
                <strong style={{ color: "#9cdcfe" }}>{item.label}:</strong> {item.value}
            </div>
        ))}
    </div>
)}






            <DialogContent
                sx={{
                    padding: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
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
