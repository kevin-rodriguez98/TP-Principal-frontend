import { useState, useCallback } from "react";
import type { TextFieldProps } from "@mui/material";

export const useValidationFields = () => {
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

    // Limpia el error de un campo
    const limpiarError = useCallback((campo: string) => {
        setValidationErrors(prev => ({ ...prev, [campo]: undefined }));
    }, []);

    // Genera props base para TextField
    const baseTextFieldProps = useCallback(
        (campo: string, extraProps: Partial<TextFieldProps> = {}) => ({
            required: true,
            error: !!validationErrors[campo],
            helperText: validationErrors[campo] ? (
                <span style={{ color: "#fd2a00ff" }}>{validationErrors[campo]}</span>
            ) : null,
            onFocus: () => limpiarError(campo),
            ...extraProps,
        }),
        [validationErrors, limpiarError]
    );

    return {
        validationErrors,
        setValidationErrors,
        limpiarError,
        baseTextFieldProps,
    };
};
