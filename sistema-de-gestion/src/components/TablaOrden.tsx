import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_Row, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography, } from "@mui/material";
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

    // const dataEjemplo = useMemo<OrdenProduccion[]>(() => [
    //     {
    //         unidad: "Kg",
    //         codigo: "OP001",
    //         producto: "Pastel de Chocolate",
    //         responsable: "Aldana",
    //         estado: "EN PROGRESO",
    //         cantidadPlaneada: 100,
    //         cantidadFinal: 80,
    //         fechaInicio: "2025-10-15",
    //         fechaFin: "2025-10-18",
    //         fechaCreacion: "2025-10-10",
    //         insumos: [
    //             {
    //                 codigo: "I001", nombre: "Harina",
    //                 unidad: "",
    //                 cantidad: ""
    //             },
    //             {
    //                 codigo: "I002", nombre: "Cacao",
    //                 unidad: "",
    //                 cantidad: ""
    //             },
    //         ],
    //     }, {
    //         unidad: "Kg",
    //         codigo: "OP001",
    //         producto: "Pastel de Chocolate",
    //         responsable: "Aldana",
    //         estado: "FINALIZADO",
    //         cantidadPlaneada: 100,
    //         cantidadFinal: 80,
    //         fechaInicio: "2025-10-15",
    //         fechaFin: "2025-10-18",
    //         fechaCreacion: "2025-10-10",
    //         insumos: [
    //             {
    //                 codigo: "I001", nombre: "Harina",
    //                 unidad: "",
    //                 cantidad: ""
    //             },
    //             {
    //                 codigo: "I002", nombre: "Cacao",
    //                 unidad: "",
    //                 cantidad: ""
    //             },
    //         ],
    //     }, {
    //         unidad: "Kg",
    //         codigo: "OP001",
    //         producto: "Pastel de Chocolate",
    //         responsable: "Aldana",
    //         estado: "PENDIENTE",
    //         cantidadPlaneada: 100,
    //         cantidadFinal: 80,
    //         fechaInicio: "2025-10-15",
    //         fechaFin: "2025-10-18",
    //         fechaCreacion: "2025-10-10",
    //         insumos: [
    //             {
    //                 codigo: "I001", nombre: "Harina",
    //                 unidad: "",
    //                 cantidad: ""
    //             },
    //             {
    //                 codigo: "I002", nombre: "Cacao",
    //                 unidad: "",
    //                 cantidad: ""
    //             },
    //         ],
    //     },
    // ], []);

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
        ],
        [validationErrors]
    );


    const validarCamposInsumo = (orden: Partial<OrdenProduccion>) => {
        const errores: Record<string, string> = {};

        if (!orden.codigo?.trim()) errores.codigo = "El código es obligatorio";
        if (!orden.producto?.trim()) errores.producto = "El producto es obligatorio";
        if (!orden.responsable?.trim()) errores.responsable = "El responsable es obligatorio";
        if (!orden.estado?.trim()) errores.estado = "El estado es obligatorio";
        if (!orden.unidad?.trim()) errores.unidad = "La unidad es obligatoria";

        if (!orden.cantidadPlaneada && orden.cantidadPlaneada !== 0)
            errores.cantidadPlaneada = "La cantidad planeada es obligatoria";

        if (!orden.cantidadFinal && orden.cantidadFinal !== 0)
            errores.cantidadFinal = "La cantidad final es obligatoria";

        if (!orden.fechaInicio?.trim())
            errores.fechaInicio = "La fecha de inicio es obligatoria";

        if (!orden.fechaFin?.trim())
            errores.fechaFin = "La fecha de fin es obligatoria";

        if (!orden.fechaCreacion?.trim())
            errores.fechaCreacion = "La fecha de creación es obligatoria";

        return errores;
    };



    // Crear insumo
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
        await handleAddOrden(values);
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
        defaultColumn: {
            minSize: 80, //allow columns to get smaller than default
            maxSize: 900, //allow columns to get larger than default
            size: 110, //make columns wider by default
            grow: 1,
            enableResizing: true,
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

                <Box sx={{ gridColumn: "span 4" }}>
                    <Typography variant="subtitle2" color="primary">
                        Insumos
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {row.original.insumos.map((insumo, index) => (
                            <li key={index}>
                                {insumo.nombre} ({insumo.codigo})
                            </li>
                        ))}
                    </ul>
                </Box>
            </Box>
        ),

        displayColumnDefOptions: {
            'mrt-row-expand': {
                size: 0,
                header: '',
                Cell: () => null,
            },
        },

        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableEditing: true,
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
                    Nueva Orden de Producción
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        padding: 2,
                    }}
                >
                    {/* Campos visibles del CRUD */}
                    {internalEditComponents}

                    {/* Campos adicionales */}
                    <TextField
                        label="Unidad"
                        variant="outlined"
                        size="small"
                        value={row._valuesCache.unidad ?? ""}
                        onChange={(e) => (row._valuesCache.unidad = e.target.value)}
                        error={!!validationErrors.unidad}
                        helperText={validationErrors.unidad}
                        fullWidth
                    />

                    <TextField
                        label="Cantidad Planeada"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={row._valuesCache.cantidadPlaneada ?? ""}
                        onChange={(e) => (row._valuesCache.cantidadPlaneada = e.target.value)}
                        error={!!validationErrors.cantidadPlaneada}
                        helperText={validationErrors.cantidadPlaneada}
                        fullWidth
                    />

                    <TextField
                        label="Cantidad Final"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={row._valuesCache.cantidadFinal ?? ""}
                        onChange={(e) => (row._valuesCache.cantidadFinal = e.target.value)}
                        error={!!validationErrors.cantidadFinal}
                        helperText={validationErrors.cantidadFinal}
                        fullWidth
                    />

                    <TextField
                        label="Fecha Inicio"
                        variant="outlined"
                        size="small"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={row._valuesCache.fechaInicio ?? ""}
                        onChange={(e) => (row._valuesCache.fechaInicio = e.target.value)}
                        error={!!validationErrors.fechaInicio}
                        helperText={validationErrors.fechaInicio}
                        fullWidth
                    />

                    <TextField
                        label="Fecha Fin"
                        variant="outlined"
                        size="small"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={row._valuesCache.fechaFin ?? ""}
                        onChange={(e) => (row._valuesCache.fechaFin = e.target.value)}
                        error={!!validationErrors.fechaFin}
                        helperText={validationErrors.fechaFin}
                        fullWidth
                    />

                    <TextField
                        label="Fecha Creación"
                        variant="outlined"
                        size="small"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={row._valuesCache.fechaCreacion ?? ""}
                        onChange={(e) => (row._valuesCache.fechaCreacion = e.target.value)}
                        error={!!validationErrors.fechaCreacion}
                        helperText={validationErrors.fechaCreacion}
                        fullWidth
                    />
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <MRT_EditActionButtons
                        table={table}
                        row={row}
                        // variant="contained"
                        color="primary"
                    />
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
