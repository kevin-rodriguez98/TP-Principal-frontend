import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_Row, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { OrdenProduccionContext, type OrdenProduccion } from "../Context/OrdenesContext";
import SinResultados from "./SinResultados";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const TablaInsumos: React.FC = () => {
    const { ordenes, isLoading, error, handleAddOrden, handleDeleteOrden } = useContext(OrdenProduccionContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const navigate = useNavigate();

    const columns = useMemo<MRT_ColumnDef<OrdenProduccion>[]>(
        () => [
            {
                header: "Código",
                accessorKey: "codigo",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
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
                header: "Producto",
                accessorKey: "producto",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.producto,
                    helperText: validationErrors.producto ? (
                        <span style={{ color: "red" }}>{validationErrors.producto}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, producto: undefined }),
                },
            },
            {
                header: "Responsable",
                accessorKey: "responsable",
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.responsable,
                    helperText: validationErrors.responsable ? (
                        <span style={{ color: "red" }}>{validationErrors.responsable}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, responsable: undefined }),
                },
            },
            {
                header: "Estado",
                accessorKey: "estado",
                editVariant: "select",
                editSelectOptions: ["EN PROGRESO", "PENDIENTE", "FINALIZADO"],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.estado,
                    helperText: validationErrors.estado ? (
                        <span style={{ color: "red" }}>{validationErrors.estado}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, estado: undefined }),
                },
                Cell: ({ cell }) => {
                    const estado = cell.getValue<OrdenProduccion["estado"]>();
                    const color =
                        estado === "FINALIZADO"
                            ? "green"
                            : estado === "EN PROGRESO"
                                ? "orange"
                                : "#00ffbbff";

                    return (
                        <span style={{ color, fontWeight: "bold" }}>
                            {estado}
                        </span>
                    );
                },
            },

            {
                accessorKey: "cantidadPlaneada",
                header: "Cantidad Planeada",
                muiEditTextFieldProps: {
                    type: "number",
                    required: true,
                    error: !!validationErrors.cantidadPlaneada,
                    helperText: validationErrors.cantidadPlaneada ? (
                        <span style={{ color: "red" }}>{validationErrors.cantidadPlaneada}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, cantidadPlaneada: undefined }),
                },
            },

            {
                accessorKey: "cantidadFinal",
                header: "Cantidad Final",
                muiEditTextFieldProps: {
                    type: "number",
                    required: true,
                    error: !!validationErrors.cantidadFinal,
                    helperText: validationErrors.cantidadFinal ? (
                        <span style={{ color: "red" }}>{validationErrors.cantidadFinal}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, cantidadFinal: undefined }),
                },
            },
            {
                accessorKey: "fechaInicio",
                header: "Fecha de Inicio",
                muiEditTextFieldProps: {
                    required: true,
                    type: "date",
                    error: !!validationErrors.fechaInicio,
                    helperText: validationErrors.fechaInicio ? (
                        <span style={{ color: "red" }}>{validationErrors.fechaInicio}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, fechaInicio: undefined }),
                },
            },
            {
                accessorKey: "fechaFin",
                header: "Fecha de Fin",
                muiEditTextFieldProps: {
                    required: true,
                    type: "date",
                    error: !!validationErrors.fechaFin,
                    helperText: validationErrors.fechaFin ? (
                        <span style={{ color: "red" }}>{validationErrors.fechaFin}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, fechaFin: undefined }),
                },
            },
            {
                accessorKey: "fechaCreacion",
                header: "Fecha de creación",
                muiEditTextFieldProps: {
                    required: true,
                    type: "date",
                    error: !!validationErrors.fechaCreacion,
                    helperText: validationErrors.fechaCreacion ? (
                        <span style={{ color: "red" }}>{validationErrors.fechaCreacion}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, fechaCreacion: undefined }),
                },
            },
            // {
            //     accessorKey: "insumos",
            //     header: "Destino", muiEditTextFieldProps: {
            //         required: true,
            //         error: !!validationErrors.insumos,
            //         helperText: validationErrors.insumos ? (
            //             <span style={{ color: "red" }}>{validationErrors.insumos}</span>
            //         ) : null,
            //         onFocus: () => setValidationErrors({ ...validationErrors, insumos: undefined }),
            //     },
            // },
        ],
        [validationErrors]
    );


    const validarCamposInsumo = (orden: Partial<OrdenProduccion>) => {
        const errores: Record<string, string> = {};

        if (!orden.codigo?.trim()) errores.codigo = "El código es requerido";
        if (!orden.producto?.trim()) errores.producto = "El producto es requerido";
        if (!orden.responsable?.trim()) errores.responsable = "El responsable es requerido";
        if (!orden.estado?.trim()) errores.estado = "El estado es requerido";
        if (!orden.cantidadPlaneada && orden.cantidadPlaneada !== 0)
            errores.cantidadPlaneada = "La cantidad planeada es requerida";

        if (!orden.cantidadFinal && orden.cantidadFinal !== 0)
            errores.cantidadFinal = "La cantidad final es requerida";

        if (!orden.fechaInicio?.trim())
            errores.fechaInicio = "La fecha de inicio es requerida";

        if (!orden.fechaFin?.trim())
            errores.fechaFin = "La fecha de fin es requerida";

        if (!orden.fechaCreacion?.trim())
            errores.fechaCreacion = "La fecha de creación es requerida";

        return errores;
    };


    const handleCrearOrden: MRT_TableOptions<OrdenProduccion>["onCreatingRowSave"] = async ({ values, table }) => {

        const errores = validarCamposInsumo(values);

        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }

        setValidationErrors({});
        await handleAddOrden(values);

        table.setCreatingRow(null);
    };

    // Editar insumo
    const handleSaveInsumo: MRT_TableOptions<OrdenProduccion>['onEditingRowSave'] = async ({ values, exitEditingMode }) => {
        const errores = validarCamposInsumo(values);

        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }



        setValidationErrors({});
        // await handleAddOrden(values);
        exitEditingMode();
    };


    const openDeleteConfirmModal = (row: MRT_Row<OrdenProduccion>) => {
        handleDeleteOrden(row.original.codigo);
    };

    const tabla = useMaterialReactTable({
        columns,
        data: ordenes,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        createDisplayMode: "modal",
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableEditing: true,
        defaultColumn: {
            minSize: 80, //allow columns to get smaller than default
            maxSize: 900, //allow columns to get larger than default
            size: 110, //make columns wider by default
            grow: 1,
            enableResizing: true,
        },
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            },
            density: 'compact',
            columnVisibility: {
                cantidadPlaneada: false,
                cantidadFinal: false,
                fechaInicio: false,
                fechaFin: false,
                fechaCreacion: false,
                // insumos: false,
            },
        },
        enableExpandAll: false,
        positionExpandColumn: 'last',
        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    display: "flex",
                    // gridTemplateColumns: "repeat(6, 1fr)",
                    // 
                    gap: 10,
                    padding: 2,
                    backgroundColor: "#2b2b2bff",
                    borderRadius: "10px",
                    color: "#fff",
                }}
            >

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Cant. Planeada
                    </Typography>
                    <Typography>{row.original.cantidadPlaneada}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Cant. Final
                    </Typography>
                    <Typography>{row.original.cantidadFinal}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Fecha Inicio
                    </Typography>
                    <Typography>{row.original.fechaInicio}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Fecha Fin
                    </Typography>
                    <Typography>{row.original.fechaFin}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Fecha Creación
                    </Typography>
                    <Typography>{row.original.fechaCreacion}</Typography>
                </Box>

                {/* <Box sx={{ gridColumn: "span 4" }}>
                    <Typography variant="subtitle2" color="primary">
                        Insumos
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {row.original.insumos.map((insumo, index) => (
                            <li key={index}>
                                {insumo.nombre} {insumo.codigo} {insumo.cantidad} {insumo.unidad}
                            </li>
                        ))}
                    </ul>
                </Box> */}
            </Box>
        ),

        displayColumnDefOptions: {
            'mrt-row-expand': {
                size: 0,
                header: '',
                Cell: () => null,
            },
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
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCrearOrden,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveInsumo,

        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
                >
                    Nuevo Orden
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
                <DialogTitle variant="h3">Editar Insumo</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {internalEditComponents}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons table={table} row={row} variant="text" />
                </DialogActions>
            </>
        ),

        renderRowActions: ({ row }) => (
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip title="Editar">
                    <IconButton onClick={() => tabla.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Detalles">
                    <IconButton color="info" onClick={() => row.toggleExpanded()}>
                        ℹ️
                    </IconButton>
                </Tooltip>
            </Box>
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
                    <span className="texto-boton">Nueva Orden</span>
                    <span className="icono-boton">➕</span>
                </Button>
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Órdenes de Producción
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

export default TablaInsumos;
