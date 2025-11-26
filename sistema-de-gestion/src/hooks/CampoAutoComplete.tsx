import { TextField, Autocomplete } from "@mui/material";

type CampoAutocompleteProps = {
    row: any;
    table: any;
    campo: string;
    opciones: string[];
    validationErrors: Record<string, string | undefined>;
    limpiarError: (campo: string) => void;
};

export const getAutocompleteFieldProps = ({
    row,
    table,
    campo,
    opciones,
    validationErrors,
    limpiarError,
}: CampoAutocompleteProps) => {
    
    return {
        InputProps: {
            inputComponent: () => (
                <Autocomplete
                    freeSolo
                    options={opciones}
                    value={row._valuesCache[campo] || ""}
                    onChange={(_event, value) => {
                        row._valuesCache[campo] = value ?? "";
                        table.setCreatingRow({
                            ...row,
                            _valuesCache: { ...row._valuesCache },
                            original: { ...row.original, ...row._valuesCache },
                        });
                    }}
                    onInputChange={(_event, value) => {
                        row._valuesCache[campo] = value ?? "";
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={!!validationErrors[campo]}
                            helperText={validationErrors[campo]}
                            onFocus={() => limpiarError(campo)}
                        />
                    )}
                />
            ),
        },
    };
};
