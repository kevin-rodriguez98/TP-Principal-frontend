import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import { Movimiento_producto_context, type movimiento_producto } from "../../../Context/Movimiento_producto_context";
import SinResultados from "../../estaticos/SinResultados";
import { ProductosContext } from "../../../Context/ProductosContext";
import { FaceAuthContext } from "../../../Context/FaceAuthContext";

const ESTILOS_CABECERA = { style: { color: "#15a017ff" } };

const TablaEgreso: React.FC = () => {
    const { movimiento_productos, handleAdd_Movimiento_producto, error, isLoading } = useContext(Movimiento_producto_context)!;
    const { productos } = useContext(ProductosContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const { user } = useContext(FaceAuthContext)!;
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

    const opcionesProductos = useMemo(() =>
        productos.map((p) => ({
            value: p.codigo,
            label: `${p.codigo} - ${p.nombre} - ${p.linea}`,
        })), [productos]);


    const columns = useMemo<MRT_ColumnDef<movimiento_producto>[]>(() => [
        {
            accessorKey: "id",
            header: "ID",
            enableEditing: false,
            muiTableHeadCellProps: ESTILOS_CABECERA,
        },
        {
            accessorKey: "codigoProducto",
            header: "Producto",
            muiTableHeadCellProps: ESTILOS_CABECERA,
            editVariant: "select",
            editSelectOptions: opcionesProductos,
            muiEditTextFieldProps: ({ row, table }) => ({
                required: true,
                error: !!validationErrors.codigoProducto,
                helperText: validationErrors.codigoProducto,
                onFocus: () => setValidationErrors({ ...validationErrors, codigoProducto: undefined }),
                onChange: (e) => {
                    const codigo = e.target.value;
                    const producto = productos.find((p) => p.codigo === codigo);
                    row._valuesCache.codigoProducto = codigo;
                    row._valuesCache.nombre = producto?.nombre || "";
                    row._valuesCache.marca = producto?.linea || "";
                    row._valuesCache.categoria = producto?.categoria || "";
                    row._valuesCache.unidad = producto?.unidad || "";
                    table.setCreatingRow({
                        ...row,
                        _valuesCache: { ...row._valuesCache },
                        original: { ...row.original, ...row._valuesCache },
                    });
                },
            }),
            Cell: ({ row }) => {
                const tipo = row.original.tipo || "EGRESO";
                const codigo = row.original.codigoProducto;
                const nombre = row.original.nombre || "";
                const marca = row.original.marca || "";
                const color = "#00d0ffff";

                return (
                    <Tooltip title={`${nombre} - ${marca}`} arrow>
                        <span style={{ color, fontWeight: "bold", cursor: "pointer" }}>
                            {tipo} {codigo}
                        </span>
                    </Tooltip>
                );
            },

        },
        {
            accessorKey: "categoria",
            header: "Categoría",
            muiTableHeadCellProps: ESTILOS_CABECERA,
            muiEditTextFieldProps: ({ row }) => ({
                value: row._valuesCache.categoria
            }),
        },
        {
            accessorKey: "marca",
            header: "Linea",
            muiTableHeadCellProps: ESTILOS_CABECERA,
            muiEditTextFieldProps: ({ row }) => ({
                value: row._valuesCache.marca
            }),
        },
        {
            accessorKey: "unidad",
            header: "Unidad",
            muiTableHeadCellProps: ESTILOS_CABECERA,
            muiEditTextFieldProps: ({ row }) => ({
                value: row._valuesCache.unidad
            }),
        },
        {
            accessorKey: "cantidad",
            header: "Cantidad",
            muiTableHeadCellProps: ESTILOS_CABECERA,
            muiEditTextFieldProps: baseTextFieldProps("cantidad"),
        },
        {
            accessorKey: "destino",
            header: "Destino",
            muiTableHeadCellProps: ESTILOS_CABECERA,
            muiEditTextFieldProps: baseTextFieldProps("destino"),
        },
        // {
        //     accessorKey: "lote",
        //     header: "Lote",
        //     muiTableHeadCellProps: ESTILOS_CABECERA,
        //     muiEditTextFieldProps: baseTextFieldProps("lote"),
        // },
        {
            accessorKey: "legajo",
            header: "Responsable",
            muiTableHeadCellProps: ESTILOS_CABECERA,
            muiEditTextFieldProps: { value: `${user?.legajo}` },
        },
    ], [validationErrors, productos]);


    const validarCamposRegistro = (registro: Partial<movimiento_producto>) => {
        const errores: Record<string, string> = {};
        if (!registro.codigoProducto?.trim()) errores.codigoProducto = "Código requerido";
        if (!registro.destino?.trim()) errores.destino = "Destino requerido";
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

        const nuevaOrden = {
            ...values,
            tipo: values.tipo && values.tipo.trim() !== "" ? values.tipo : "EGRESO",
            legajo: values.legajo && values.legajo.trim() !== "" ? values.legajo : "100",

        };

        setValidationErrors({});
        await handleAdd_Movimiento_producto(nuevaOrden);
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
                legajo: false,
            },
        },
        getRowId: (row) => String(row.id),
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
                        Destino
                    </Typography>
                    <Typography>{row.original.destino}</Typography>
                </Box>
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

export default TablaEgreso;





















