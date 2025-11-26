import { Autocomplete, TextField } from "@mui/material";
import { type Insumo } from "../../Context/InsumoContext";
import { ESTANTES, type Estante } from "./data";
import { useState } from "react";

interface Props {
    insumos: Insumo[];
    estantes: Estante[];
    setMarker: (m: { x: number; y: number; label: string } | null) => void;
}

export default function BusquedaInsumo({ insumos, setMarker}: Props) {
const [searchError, setSearchError] = useState<string | null>(null);

    const handleSearch = (codigoBuscado: string) => {
        const insumo = insumos.find(i => i.codigo === codigoBuscado);
        if (!insumo) {
            setSearchError("Producto no encontrado.");
            return;
        }
        const shelfId = insumo.locacion?.estante;
        const posId = insumo.locacion?.posicion;
        if (!shelfId) {
            setSearchError("El producto no tiene estante asignado.");
            setMarker(null)
            return;
        }
        const shelf = ESTANTES.find(s => s.id === shelfId);
        if (!shelf) {
            setSearchError("Estante no encontrado.");
            setMarker(null)
            return;
        }
        setSearchError(null);
        setMarker(null);

        // calcular coordenadas
        let targetX = shelf.x + shelf.width / 2;
        let targetY = shelf.y + shelf.height / 2;
        if (posId && shelf.posiciones?.[posId]) {
            targetX = shelf.x + shelf.posiciones[posId].x;
            targetY = shelf.y + shelf.posiciones[posId].y;
        }
        // colocar marcador
        setMarker({
            x: targetX,
            y: targetY,
            label: `${insumo.codigo} (${shelfId}-${posId ?? ""})`,
        });

    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "700px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                marginBottom: 10,
            }}
        >
            <div style={{ display: "flex", gap: 8 }}>
                <Autocomplete
                    options={insumos}
                    getOptionLabel={(option) =>
                        `${option.codigo} - ${option.nombre} - ${option.marca} - ${option.categoria}`
                    }
                    onChange={(_event, value) => {
                        if (!value) return;
                        handleSearch(value.codigo);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Buscar insumo"
                            placeholder="Código, nombre, marca..."
                            size="small"
                            sx={{
                                mb: 1.5,
                                borderRadius: 2,

                                // fondo campo
                                "& .MuiInputBase-root": {
                                    backgroundColor: "#0e1217",
                                    color: "white",
                                },

                                // label
                                "& .MuiInputLabel-root": {
                                    color: "#bbbbbb",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#ffffff",
                                },

                                // placeholder
                                "& .MuiInputBase-input::placeholder": {
                                    color: "#cccccc",
                                    opacity: 1,
                                },

                                // borde
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#555",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#888",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#00bcd4",
                                },
                            }}
                        />
                    )}
                    sx={{
                        width: "100%",

                        // estilo del dropdown
                        "& .MuiAutocomplete-paper": {
                            backgroundColor: "#0e1217",
                            color: "white",
                        },

                        // estilo de cada ítem
                        "& .MuiAutocomplete-option": {
                            backgroundColor: "#0e1217",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#111827",
                            },
                            "&.Mui-focused": {
                                backgroundColor: "#1a2131ff",
                            },
                            "&.Mui-selected": {
                                backgroundColor: "#0a070eff",
                            },
                            "&.Mui-selected:hover": {
                                backgroundColor: "#0f0227ff",
                            },
                        },
                    }}
                />
            </div>
            {searchError && (
                <div style={{ color: "red", fontSize: "14px" }}>
                    {searchError}
                </div>
            )}
        </div>

    );
}
