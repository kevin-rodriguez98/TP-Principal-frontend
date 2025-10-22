import React, { useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import { Movimiento_insumo_context, type movimiento_insumo } from "../../Context/Movimiento_insumo_context";
import { IoArrowBackCircleSharp } from "react-icons/io5";
// import { DeleteIcon, EditIcon } from "lucide-react";
import SinResultados from "../SinResultados";

export const TablaInsumos: React.FC = () => {
    const { movimiento_insumos, handleAdd_Movimiento_insumo, isLoading, error } = useContext(Movimiento_insumo_context)!;
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});


    // const data: movimiento_insumo[] = useMemo(
    //     () => [
    //         {
    //             codigo: "P001",
    //             nombre: "Yogur Natural",
    //             tipo: "INGRESO",
    //             categoria: "Lácteos",
    //             marca: "La Serenísima",
    //             stock: 120,
    //             unidad: "unidad",
    //             lote: "L001",
    //             proveedor: "Sucursal Centro",
    //         },
    //         {
    //             codigo: "P002",
    //             nombre: "Queso Cremoso",
    //             tipo: "INGRESO",
    //             categoria: "Quesos",
    //             marca: "Milkaut",
    //             stock: 80,
    //             unidad: "kilogramos",
    //             lote: "L002",
    //             proveedor: "Sucursal Norte",
    //         },
    //         {
    //             codigo: "P003",
    //             nombre: "Postre de Vainilla",
    //             tipo: "INGRESO",
    //             categoria: "Postres",
    //             marca: "Yogurísimo",
    //             stock: 50,
    //             unidad: "unidad",
    //             lote: "L003",
    //             proveedor: "Sucursal Sur",
    //         },
    //     ],
    //     []
    // );

    const columns = useMemo<MRT_ColumnDef<movimiento_insumo>[]>(
        () => [
            {
                accessorKey: "codigo",
                header: "Código",
                size: 100,
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
                accessorKey: "tipo",
                header: "Tipo",
                editVariant: "select",
                editSelectOptions: ["INGRESO"],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.tipo,
                    helperText: validationErrors.tipo ? (
                        <span style={{ color: "red" }}>{validationErrors.tipo}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, tipo: undefined }),
                },
                Cell: ({ cell }) => {
                    const estado = cell.getValue<movimiento_insumo["tipo"]>();
                    const color = "#ffff00ff"
                    return (
                        <span style={{ color, fontWeight: "bold" }}>
                            {estado}
                        </span>
                    );
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
                editSelectOptions: ["unidad", "miligramos", "gramos", "litros", "kilogramos", "toneladas"],
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
                muiEditTextFieldProps: {
                    type: "number",
                    required: true,
                    error: !!validationErrors.stock,
                    helperText: validationErrors.stock ? (
                        <span style={{ color: "red" }}>{validationErrors.stock}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, stock: undefined }),
                },
            },
            {
                accessorKey: "lote",
                header: "Lote",
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.lote,
                    helperText: validationErrors.lote ? (
                        <span style={{ color: "red" }}>{validationErrors.lote}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, lote: undefined }),
                },
            },
            {
                accessorKey: "proveedor",
                header: "Proveedor",
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.proveedor,
                    helperText: validationErrors.proveedor ? (
                        <span style={{ color: "red" }}>{validationErrors.proveedor}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, proveedor: undefined }),
                },
            },
        ],
        [validationErrors]
    );

    const validarCamposRegistro = (registro: Partial<movimiento_insumo>) => {
        const errores: Record<string, string> = {};
        if (!registro.codigo?.trim()) errores.codigo = "Código requerido";
        if (!registro.nombre?.trim()) errores.nombre = "Nombre requerido";
        if (!registro.categoria?.trim()) errores.categoria = "Categoría requerida";
        if (!registro.marca?.trim()) errores.marca = "Marca requerida";
        if (!registro.unidad?.trim()) errores.unidad = "Medida requerida";
        if (!registro.lote?.trim()) errores.lote = "Lote requerido";
        if (!registro.proveedor?.trim()) errores.proveedor = "Proveedor requerido";
        if (!registro.tipo?.trim()) errores.tipo = "Tipo requerido";
        const stockNumber = Number(registro.stock);
        if (registro.stock === undefined || registro.stock === null || isNaN(stockNumber) || stockNumber <= 0) {
            errores.stock = "Stock debe ser un número válido mayor a 0";
        }
        return errores;
    };

    const handleCreateRegistro: MRT_TableOptions<movimiento_insumo>["onCreatingRowSave"] = async ({ values, table }) => {
        const errores = validarCamposRegistro(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }
        setValidationErrors({});
        await handleAdd_Movimiento_insumo(values);
        table.setCreatingRow(null);
    };

    const tabla_movimiento_ingreso = useMaterialReactTable({
        columns: columns,
        data: movimiento_insumos,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        defaultColumn: {
            minSize: 80, //allow columns to get smaller than default
            maxSize: 900, //allow columns to get larger than default
            size: 150, //make columns wider by default
            grow: 1,
            enableResizing: true,
        },
        displayColumnDefOptions: {
            'mrt-row-expand': {
                size: 0,
                header: '',
                Cell: () => null,
            },
        },
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
            density: 'compact',
            columnVisibility: {
                unidad: false,
                stock: false,
                lote: false,
                // responsable: false,
                proveedor: false,
            },
        },
        positionExpandColumn: 'last',
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableExpandAll: false,
        // enableColumnOrdering: true,

        getRowId: (row) => row.codigo,
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateRegistro,

        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    display: "flex",
                    gap: 25,
                    padding: 2,
                    backgroundColor: "#2b2b2bff",
                    borderRadius: "10px",
                    color: "#fff",
                }}
            >
                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Stock
                    </Typography>
                    <Typography>{row.original.stock}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Unidad
                    </Typography>
                    <Typography>{row.original.unidad}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Lote
                    </Typography>
                    <Typography>{row.original.lote}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Proveedor
                    </Typography>
                    <Typography>{row.original.proveedor}</Typography>
                </Box>
                {/* <Box>
                    <Typography variant="subtitle2" color="primary">
                        Responsable
                    </Typography>
                    <Typography>{row.original.creationUsername}</Typography>
                </Box> */}
            </Box >
        ),

        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip title="Detalles">
                    <IconButton
                        color="info"
                        onClick={() => table.setExpanded({ [row.id]: !row.getIsExpanded() })}
                    >
                        ℹ️
                    </IconButton>
                </Tooltip>
            </Box>
        ),

        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                >
                    Nuevo ingreso
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        padding: 2,
                    }}
                >
                    {internalEditComponents}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <MRT_EditActionButtons table={table} row={row} color="primary" />
                </DialogActions>
            </>
        ),

        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Editar Registro</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {internalEditComponents}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons table={table} row={row} variant="text" />
                </DialogActions>
            </>
        ),

        renderTopToolbarCustomActions: ({ table }) => (
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
                <Button
                    variant="contained"
                    onClick={() => table.setCreatingRow(true)}
                    className="boton-agregar-insumo"
                >
                    <span className="texto-boton">Nuevo ingreso</span>
                    <span className="icono-boton">➕</span>
                </Button>
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Ingreso de Insumos
                    </Typography>
                </Box>
            </Box>
        ),

        renderEmptyRowsFallback: () => {
            if (error) {
                return <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />;
            }
            return <SinResultados mensaje="No hay registros disponibles para mostrar." />;
        },

        muiExpandButtonProps: ({ row, table }) => ({
            onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
            sx: {
                transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
            },
        }),

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

    return <MaterialReactTable table={tabla_movimiento_ingreso} />;

};

export default TablaInsumos;
