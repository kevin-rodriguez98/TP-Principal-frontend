import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Button, CircularProgress, Typography, } from "@mui/material";
import { InsumoContext, type Insumo } from "../../../Context/InsumoContext";
import { FaExclamationTriangle } from "react-icons/fa";
import SinResultados from "../../SinResultados";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const InsumosBajoStock: React.FC = () => {
    const { insumos_bajo_stock, isLoading, error } = useContext(InsumoContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const navigate = useNavigate();

    const columns = useMemo<MRT_ColumnDef<Insumo>[]>(
        () => [
            {
                accessorKey: "codigo",
                header: "Código",
                size: 90,
                enableEditing: (row) => row.original.codigo === "",
                muiTableHeadCellProps: {
                    style: { color: "#15a017ff" },
                },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.codigo,
                    helperText: validationErrors.codigo ? (
                        <span style={{ color: "red" }}>{validationErrors.codigo}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, codigo: undefined }),
                },
            },
            {
                accessorKey: "nombre",
                header: "Nombre",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.nombre,
                    helperText: validationErrors.nombre ? (
                        <span style={{ color: "red" }}>{validationErrors.nombre}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, nombre: undefined }),
                },
            },
            {
                accessorKey: "categoria",
                header: "Categoría",
                editVariant: "select",
                editSelectOptions: ["Lácteos", "Quesos", "Postres", "Crema", "Congelados", "Otros"],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.categoria,
                    helperText: validationErrors.categoria ? (
                        <span style={{ color: "red" }}>{validationErrors.categoria}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, categoria: undefined }),
                },
            },
            {
                accessorKey: "marca",
                header: "Marca",
                editVariant: "select",
                editSelectOptions: ["La Serenísima", "Sancor", "Milkaut", "La Paulina", "Yogurísimo", "Ilolay"],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.marca,
                    helperText: validationErrors.marca ? (
                        <span style={{ color: "red" }}>{validationErrors.marca}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, marca: undefined }),
                },
            },
            {
                accessorKey: "unidad",
                header: "Unidad",
                editVariant: "select",
                editSelectOptions: ["Unidad", "lts. ", "g. ", "kg. ", "ton. "],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.unidad,
                    helperText: validationErrors.unidad ? (
                        <span style={{ color: "red" }}>{validationErrors.unidad}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, unidad: undefined }),
                },
            },
            {
                accessorKey: "stock",
                header: "Stock",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    type: "number",
                    inputProps: { min: 0 },
                    required: true,
                    error: !!validationErrors.stock,
                    helperText: validationErrors.stock ? (
                        <span style={{ color: "red" }}>{validationErrors.stock}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, stock: undefined }),
                },
                Cell: ({ row }) => {
                    const stock = row.original.stock;
                    const umbral = row.original.umbralMinimoStock;
                    const isLow = stock < umbral;
                    return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Typography sx={{ color: isLow ? "red" : "inherit" }}>{stock}</Typography>
                            {isLow && (
                                <FaExclamationTriangle color="red" title="debajo del umbral" />
                            )}
                        </Box>
                    );
                },
            },
            {
                accessorKey: "umbralMinimoStock",
                header: "Umbral mínimo",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    type: "number",
                    required: true,
                    error: !!validationErrors.umbralMinimoStock,
                    helperText: validationErrors.umbralMinimoStock ? (
                        <span style={{ color: "red" }}>{validationErrors.umbralMinimoStock}</span>
                    ) : null,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            umbralMinimoStock: undefined,
                        }),
                },
            },
        ],
        [validationErrors]
    );



    const tabla = useMaterialReactTable({
        columns,
        data: insumos_bajo_stock,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        createDisplayMode: "modal",
        defaultColumn: {
            minSize: 80, //allow columns to get smaller than default
            maxSize: 900, //allow columns to get larger than default
            size: 110, //make columns wider by default
            grow: 1,
            enableResizing: true,
        },
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
            density: 'compact',
        },
        muiTableContainerProps: {
            className: "tabla-container",
        },
        muiTableBodyCellProps: {
            className: "tabla-body-cell",
        },
        muiTableHeadCellProps: {
            className: "tabla-head-cell",
        },
        muiTablePaperProps: {
            className: "tabla-paper",
        },
        muiTableProps: {
            className: "tabla",
        },

        getRowId: (row) => row.codigo,

        renderTopToolbarCustomActions: ({}) => (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    width: '100%',
                    gap: 2,
                }}
            >
                <Button
                    onClick={() => navigate("/")}
                    className="btn-volver"
                    variant="contained"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "#2b2b2b",
                        color: "#fff",
                        borderRadius: "30px",
                        padding: "8px 16px",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#444",
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    <IoArrowBackCircleSharp size={28} style={{ color: "#ff4b4b" }} />
                </Button>
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Insumos con bajo stock
                    </Typography>

                </Box>
            </Box>
        ),
        renderEmptyRowsFallback: () => {
            if (error) {
                return <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />;
            }
            return <SinResultados mensaje="No hay insumos disponibles para mostrar." />;
        },
        state: {
            isLoading,
        },
    },
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MaterialReactTable table={tabla} />
    );
};

export default InsumosBajoStock;
