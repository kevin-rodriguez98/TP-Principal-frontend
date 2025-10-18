import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography, } from "@mui/material";
import { RegistroContext, type Registro } from "../../Context/RegistroContext";
import SinResultados from "../SinResultados";
import { useNavigate } from "react-router-dom";
// import { DeleteIcon, EditIcon } from "lucide-react";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const TablaRegistro: React.FC = () => {
    const { registros, handleAddRegistro, isLoading, error } = useContext(RegistroContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const navigate = useNavigate();

    // const dataEjemplo = useMemo<Registro[]>(() => [
    //     {
    //         unidad: "Kg",
    //         codigo: "123",
    //         nombre: "aldana",
    //         categoria: "categoria",
    //         marca: "marca",
    //         tipo: "INGRESO",
    //         stock: 0,
    //         lote: "2020",
    //         responsable: "JO",
    //         proveedor: "SDGVS",
    //         destino: "SDVS  "
    //     },
    //     {
    //         unidad: "Kg",
    //         codigo: "123",
    //         nombre: "aldana",
    //         categoria: "categoria",
    //         marca: "marca",
    //         tipo: "EGRESO",
    //         stock: 0,
    //         lote: "2020",
    //         responsable: "JO",
    //         proveedor: "SDGVS",
    //         destino: "SDVS  "
    //     }
    // ], []);

    const columns = useMemo<MRT_ColumnDef<Registro>[]>(
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
                editSelectOptions: ["INGRESO", "EGRESO"],
                muiTableHeadCellProps: { style: { color: "#15a017ff" } },
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors.categoria,
                    helperText: validationErrors.categoria ? (
                        <span style={{ color: "red" }}>{validationErrors.categoria}</span>
                    ) : null,
                    onFocus: () => setValidationErrors({ ...validationErrors, categoria: undefined }),
                },
                Cell: ({ cell }) => {
                    const estado = cell.getValue<Registro["tipo"]>();
                    const color =
                        estado === "INGRESO"
                            ? "#33ff00ff"
                            : "#ffee00ff";

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
        ],
        [validationErrors]
    );

    const validarCamposRegistro = (registro: Partial<Registro>) => {
        const errores: Record<string, string> = {};

        // Código solo obligatorio al crear
        if (!registro.codigo?.trim()) errores.codigo = "Código requerido";
        if (!registro.nombre?.trim()) errores.nombre = "Nombre requerido";
        if (!registro.categoria?.trim()) errores.categoria = "Categoría requerida";
        if (!registro.marca?.trim()) errores.marca = "Marca requerida";
        if (!registro.unidad?.trim()) errores.unidad = "Unidad requerida";
        if (!registro.lote?.trim()) errores.lote = "Unidad requerida";
        if (!registro.proveedor?.trim()) errores.proveedor = "Unidad requerida";
        if (!registro.destino?.trim()) errores.destino = "Unidad requerida";
        if (!registro.responsable?.trim()) errores.responsable = "Unidad requerida";
        if (!registro.tipo?.trim()) errores.tipo = "Unidad requerida";
        const stockNumber = Number(registro.stock);
        if (registro.stock === undefined || registro.stock === null || isNaN(stockNumber) || stockNumber <= 0) {
            errores.stock = "Stock debe ser un número válido mayor o igual a 0";
        }
        return errores;
    };

    const handleCreateRegistro: MRT_TableOptions<Registro>["onCreatingRowSave"] = async ({ values, table }) => {
        const errores = validarCamposRegistro(values);
        if (Object.keys(errores).length > 0) {
            setValidationErrors(errores);
            return;
        }
        setValidationErrors({});
        await handleAddRegistro(values);
        table.setCreatingRow(null);
    };

    const tabla = useMaterialReactTable({
        columns,
        data: registros,
        enableColumnResizing: true,
        columnResizeMode: 'onEnd',
        defaultColumn: {
            minSize: 80, //allow columns to get smaller than default
            maxSize: 900, //allow columns to get larger than default
            size: 150, //make columns wider by default
            grow: 1,
            enableResizing: true,
        },
        positionExpandColumn: 'last',

        // ✅ (opcional) muestra ícono personalizado
        muiExpandButtonProps: ({ row, table }) => ({
            onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
            sx: {
                transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
            },
        }),

        // ✅ Define el contenido expandido
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
                        Unidad
                    </Typography>
                    <Typography>{row.original.unidad}</Typography>
                </Box>

                <Box>
                    <Box>
                        <Typography variant="subtitle2" color="primary">
                            Stock
                        </Typography>
                        <Typography>{row.original.stock}</Typography>
                    </Box>
                    <Typography variant="subtitle2" color="primary">
                        Proveedor
                    </Typography>
                    <Typography>{row.original.proveedor}</Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Destino
                    </Typography>
                    <Typography>{row.original.destino}</Typography>
                </Box>


                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Responsable
                    </Typography>
                    <Typography>{row.original.responsable}</Typography>
                </Box>

                <Box sx={{ gridColumn: "span 4" }}>
                    <Typography variant="subtitle2" color="primary">
                        Registros
                    </Typography>
                </Box>
            </Box >
        ),
        enableRowActions: true,
        positionActionsColumn: 'last',


        enableGlobalFilter: true,
        editDisplayMode: "modal",
        // enableColumnOrdering: true,
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
        onCreatingRowSave: handleCreateRegistro,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
                {/* <Tooltip title="Editar">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip> */}
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
                    Nuevo Registro
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
                        type='string'
                        value={row._valuesCache.unidad ?? ""}
                        onChange={(e) => (row._valuesCache.unidad = e.target.value)}
                        error={!!validationErrors.unidad}
                        helperText={validationErrors.unidad}
                        fullWidth
                    />

                    <TextField
                        label="Stock"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={row._valuesCache.stock ?? ""}
                        onChange={(e) => (row._valuesCache.stock = e.target.value)}
                        error={!!validationErrors.stock}
                        helperText={validationErrors.stock}
                        fullWidth
                    />

                    <TextField
                        label="Lote"
                        variant="outlined"
                        size="small"
                        type="string"
                        value={row._valuesCache.lote ?? ""}
                        onChange={(e) => (row._valuesCache.lote = e.target.value)}
                        error={!!validationErrors.lote}
                        helperText={validationErrors.lote}
                        fullWidth
                    />

                    <TextField
                        label="Responsable"
                        variant="outlined"
                        size="small"
                        type="string"
                        InputLabelProps={{ shrink: true }}
                        value={row._valuesCache.responsable ?? ""}
                        onChange={(e) => (row._valuesCache.responsable = e.target.value)}
                        error={!!validationErrors.responsable}
                        helperText={validationErrors.responsable}
                        fullWidth
                    />

                    <TextField
                        label="Proveedor"
                        variant="outlined"
                        size="small"
                        type="string"
                        InputLabelProps={{ shrink: true }}
                        value={row._valuesCache.proveedor ?? ""}
                        onChange={(e) => (row._valuesCache.proveedor = e.target.value)}
                        error={!!validationErrors.proveedor}
                        helperText={validationErrors.proveedor}
                        fullWidth
                    />

                    <TextField
                        label="Destino"
                        variant="outlined"
                        size="small"
                        type="string"
                        InputLabelProps={{ shrink: true }}
                        value={row._valuesCache.destino ?? ""}
                        onChange={(e) => (row._valuesCache.destino = e.target.value)}
                        error={!!validationErrors.destino}
                        helperText={validationErrors.destino}
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
                    <span className="texto-boton">Agregar Registro</span>
                    <span className="icono-boton">➕</span>
                </Button>
                <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
                    <Typography variant="h5" color="primary" className="titulo-lista-insumos">
                        Registros
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

export default TablaRegistro;
