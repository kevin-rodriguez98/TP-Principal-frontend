import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import { Movimiento_insumo_context, type movimiento_insumo } from "../../../Context/Movimiento_insumo_context";
import SinResultados from "../../estaticos/SinResultados";
import { InsumoContext } from "../../../Context/InsumoContext";
import { FaceAuthContext } from "../../../Context/FaceAuthContext";


const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };

export const TablaInsumos: React.FC = () => {
    const { movimiento_insumos, handleAdd_Movimiento_insumo, isLoading, error } = useContext(Movimiento_insumo_context)!;
    const { insumos } = useContext(InsumoContext)!;
    const { user } = useContext(FaceAuthContext)!;

    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const limpiarError = (campo: string) =>
        setValidationErrors((prev) => ({ ...prev, [campo]: undefined }));

    const baseTextFieldProps = (campo: string, extraProps = {}) => ({
        required: true,
        error: !!validationErrors[campo],
        helperText: validationErrors[campo] ? (
            <span style={{ color: "red" }}>{validationErrors[campo]}</span>
        ) : null,
        onFocus: () => limpiarError(campo),
        ...extraProps,
    });

    const columns = useMemo<MRT_ColumnDef<movimiento_insumo>[]>(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
            },
            {
                accessorKey: "codigo",
                header: "Insumo",
                muiTableHeadCellProps: ESTILOS_CABECERA,
                editVariant: "select",
                editSelectOptions: insumos.map((p) => ({ value: p.codigo, label: p.codigo + " - " + p.nombre })),
                muiEditTextFieldProps: ({ row, table }) => ({
                    required: true,
                    onChange: (e) => {
                        const codigo = e.target.value;
                        const insumo = insumos.find((p) => p.codigo === codigo);
                        row._valuesCache.codigo = codigo;
                        row._valuesCache.nombre = insumo?.nombre || "";
                        row._valuesCache.marca = insumo?.marca || "";
                        row._valuesCache.categoria = insumo?.categoria || "";
                        row._valuesCache.unidad = insumo?.unidad || "";

                        table.setCreatingRow({
                            ...row,
                            _valuesCache: { ...row._valuesCache },
                            original: { ...row.original, ...row._valuesCache },
                        });
                    },
                    error: !!validationErrors.codigo,
                    helperText: validationErrors.codigo,
                    onFocus: () => setValidationErrors({ ...validationErrors, codigo: undefined }),
                }),
                Cell: ({ row }) => {
                    const tipo = row.original.tipo || "INGRESO";
                    const codigo = row.original.codigo;
                    const color = "#ffff00ff";
                    return (
                        <span style={{ color, fontWeight: "bold" }}>
                            {tipo} {codigo}
                        </span>
                    );
                },
            },
            {
                accessorKey: "nombre",
                header: "Nombre",
                enableEditing: false, // solo lectura
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.nombre
                }),
                Cell: ({ row }) => row.original.nombre || "—",

            },
            {
                accessorKey: "categoria",
                header: "Categoría",
                enableEditing: false, // solo lectura
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.categoria
                }),
                Cell: ({ row }) => row.original.categoria || "—",
            },
            {
                accessorKey: "marca",
                header: "Marca",
                enableEditing: false,
                muiTableHeadCellProps: ESTILOS_CABECERA,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.marca
                }),
                Cell: ({ row }) => row.original.marca || "—",
            },
            {
                accessorKey: "unidad",
                header: "Unidad",
                enableEditing: false,
                muiEditTextFieldProps: ({ row }) => ({
                    value: row._valuesCache.unidad
                }),
            },
            {
                accessorKey: "stock",
                header: "Stock",
                muiEditTextFieldProps: baseTextFieldProps("stock", { type: "number" }),
            },
            {
                accessorKey: "lote",
                header: "Lote",
                muiEditTextFieldProps: baseTextFieldProps("lote"),
            },
            {
                accessorKey: "proveedor",
                header: "Proveedor",
                muiEditTextFieldProps: baseTextFieldProps("proveedor"),
            },
            {
                accessorKey: "responsable",
                header: "Responsable",
                enableEditing: false,
                muiEditTextFieldProps: { value: `${user?.legajo}` },
            },
            {
                accessorKey: "fechaHora",
                header: "Fecha Ingreso",
                enableEditing: false,
                muiEditTextFieldProps: { value: new Date().toLocaleString() },
            },
        ],
        [validationErrors]
    );

    const validar = (registro: Partial<movimiento_insumo>) => {
        const errores: Record<string, string> = {};
        if (!registro.codigo?.trim()) errores.codigo = "Codigo insumo requerido";
        if (!registro.lote?.trim()) errores.lote = "Lote requerido";
        if (!registro.proveedor?.trim()) errores.proveedor = "Proveedor requerido";
        const stockNumber = Number(registro.stock);
        if (registro.stock === undefined || registro.stock === null || isNaN(stockNumber) || stockNumber <= 0) {
            errores.stock = "Stock debe ser un número válido mayor a 0";
        }
        return errores;
    };

    const handleCreateRegistro: MRT_TableOptions<movimiento_insumo>["onCreatingRowSave"] = async ({ values, table }) => {
        const errores = validar(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }

        const nuevaOrden = {
            ...values,
            tipo: values.tipo && values.tipo.trim() !== "" ? values.tipo : "INGRESO",
        };
        setValidationErrors({});
        await handleAdd_Movimiento_insumo(nuevaOrden);
        table.setCreatingRow(null);
    };

    const tabla_movimiento_ingreso = useMaterialReactTable({
        columns: columns,
        data: movimiento_insumos,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
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
                stock: false,
                lote: false,
                responsable: false,
                proveedor: false,
            },
        },
        positionExpandColumn: 'last',
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableExpandAll: false,
        getRowId: (row) => String(row.id),
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
                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Responsable
                    </Typography>
                    <Typography>{row.original.responsable}</Typography>
                </Box>
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
