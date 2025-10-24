import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import { Movimiento_producto_context, type movimiento_producto } from "../../Context/Movimiento_producto_context";
import SinResultados from "../SinResultados";
import { useNavigate } from "react-router-dom";
// import { DeleteIcon, EditIcon } from "lucide-react";
import { IoArrowBackCircleSharp } from "react-icons/io5";


const TablaProductosEgreso: React.FC = () => {
    const { movimiento_productos, handleAdd_Movimiento_producto, error, isLoading } = useContext(Movimiento_producto_context)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const navigate = useNavigate();


    // const data: movimiento_producto[] = useMemo(
    //     () => [
    //         {
    //             codigoProducto: "P001",
    //             nombre: "Yogur Natural",
    //             tipo: "EGRESO",
    //             categoria: "Lácteos",
    //             marca: "La Serenísima",
    //             cantidad: 120,
    //             unidad: "unidad",
    //             lote: "L001",
    //             destino: "Sucursal Centro",
    //         },
    //         {
    //             codigoProducto: "P002",
    //             nombre: "Queso Cremoso",
    //             tipo: "EGRESO",
    //             categoria: "Quesos",
    //             marca: "Milkaut",
    //             cantidad: 80,
    //             unidad: "kilogramos",
    //             lote: "L002",
    //             destino: "Sucursal Norte",
    //         },
    //         {
    //             codigoProducto: "P003",
    //             nombre: "Postre de Vainilla",
    //             tipo: "EGRESO",
    //             categoria: "Postres",
    //             marca: "Yogurísimo",
    //             cantidad: 50,
    //             unidad: "unidad",
    //             lote: "L003",
    //             destino: "Sucursal Sur",
    //         },
    //     ],
    //     []
    // );

    const columns = useMemo<MRT_ColumnDef<movimiento_producto>[]>(
        () => [
            {
                accessorKey: "codigoProducto",
                header: "Codigo",
                size: 100,
                muiTableHeadCellProps: {
                    style: { color: "#15a017ff" },
                },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.codigoProducto,
                    helperText: validationErrors.codigoProducto ? (
                        <span style={{ color: "red" }}>{validationErrors.codigoProducto}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, codigoProducto: undefined }),
                },
            },
            {
                accessorKey: "nombre",
                header: "Producto",
                size: 100,
                muiTableHeadCellProps: {
                    style: { color: "#15a017ff" },
                },
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
                editSelectOptions: ["EGRESO"],
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
                    const estado = cell.getValue<movimiento_producto["tipo"]>();
                    const color = "#00d0ffff";
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
                accessorKey: "cantidad",
                header: "Cantidad",
                muiEditTextFieldProps: {
                    type: "number",
                    required: true,
                    error: !!validationErrors.cantidad,
                    helperText: validationErrors.cantidad ? (
                        <span style={{ color: "red" }}>{validationErrors.cantidad}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, cantidad: undefined }),
                },
            },
            {
                accessorKey: "unidad",
                header: "Unidad",
                editVariant: "select",
                editSelectOptions: ["unidad", "gramos", "litros", "kilogramos", "toneladas"],
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
                accessorKey: "destino",
                header: "Destino",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.destino,
                    helperText: validationErrors.destino ? (
                        <span style={{ color: "red" }}>{validationErrors.destino}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, destino: undefined }),
                },
            },
        ],
        [validationErrors]
    );

    const validarCamposRegistro = (registro: Partial<movimiento_producto>) => {
        const errores: Record<string, string> = {};
        if (!registro.codigoProducto?.trim()) errores.codigoProducto = "Código requerido";
        if (!registro.nombre?.trim()) errores.nombre = "Nombre requerido";
        if (!registro.categoria?.trim()) errores.categoria = "Categoria requerida";
        if (!registro.marca?.trim()) errores.marca = "Marca requerida";
        if (!registro.unidad?.trim()) errores.unidad = "Medida requerida";
        if (!registro.lote?.trim()) errores.lote = "Lote requerido";
        if (!registro.destino?.trim()) errores.destino = "Destino requerido";
        if (!registro.tipo?.trim()) errores.tipo = "Tipo requerido";
        const cantidad = Number(registro.cantidad);
        if (registro.cantidad === undefined || registro.cantidad === null || isNaN(cantidad) || cantidad <= 0) {
            errores.cantidad = "Cantidad debe ser un número válido mayor a 0";
        }
        return errores;
    };

    const handleAdd: MRT_TableOptions<movimiento_producto>["onCreatingRowSave"] = async ({ values, table }) => {
        const errores = validarCamposRegistro(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }

        setValidationErrors({});
        await handleAdd_Movimiento_producto(values);
        table.setCreatingRow(null);
    }

    
    const tabla_movimiento_egreso = useMaterialReactTable({
        columns: columns,
        data: movimiento_productos,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        positionExpandColumn: 'last',
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableExpandAll: false,
        // enableColumnOrdering: true,
        defaultColumn: {
            minSize: 80,
            maxSize: 900,
            size: 150,
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
                cantidad: false,
                lote: false,
                // responsable: false,
                destino: false,
            },
        },
        getRowId: (row) => row.codigoProducto,
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleAdd,
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
                    <Typography>{row.original.cantidad}</Typography>
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
                        Destino
                    </Typography>
                    <Typography>{row.original.destino}</Typography>
                </Box>
                {/* <Box>
                    <Typography variant="subtitle2" color="primary">
                        Responsable
                    </Typography>
                    <Typography>{row.original.creationUsername}</Typography>
                </Box> */}
            </Box >
        ),

        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                >
                    Nuevo egreso
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
                    <span className="texto-boton">Nuevo Egreso</span>
                    <span className="icono-boton">➕</span>
                </Button>
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Egreso de Productos
                    </Typography>
                </Box>
            </Box>
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

    return <MaterialReactTable table={tabla_movimiento_egreso} />;
};

export default TablaProductosEgreso;





















