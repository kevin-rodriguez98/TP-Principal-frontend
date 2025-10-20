import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_TableOptions, MRT_EditActionButtons } from "material-react-table";
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, } from "@mui/material";
import { RegistroContext, type Registro } from "../../Context/RegistroContext";
import SinResultados from "../SinResultados";
import { useNavigate } from "react-router-dom";
// import { DeleteIcon, EditIcon } from "lucide-react";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const TablaRegistro: React.FC = () => {
    const { registros, handleAddRegistro, isLoading, error } = useContext(RegistroContext)!;
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
    const navigate = useNavigate();


    // const ejemplo = useMemo<Registro[]>(() => [
    //     {
    //         codigo: "R001",
    //         nombre: "Leche Entera",
    //         tipo: "INGRESO",
    //         categoria: "Lácteos",
    //         marca: "La Serenísima",
    //         unidad: "litros",
    //         stock: 250,
    //         lote: "L001",
    //         creationUsername: "Juan Pérez",
    //         proveedor: "Distribuidora Central",
    //         destino: "Depósito A",
    //     },
    //     {
    //         codigo: "R002",
    //         nombre: "Yogur Natural",
    //         tipo: "EGRESO",
    //         categoria: "Postres",
    //         marca: "Milkaut",
    //         unidad: "kilogramos",
    //         stock: 75,
    //         lote: "L002",
    //         creationUsername: "María López",
    //         proveedor: "Fábrica Sur",
    //         destino: "Planta B",
    //     },
    //     {
    //         codigo: "R003",
    //         nombre: "Queso Cremoso",
    //         tipo: "INGRESO",
    //         categoria: "Quesos",
    //         marca: "Ilolay",
    //         unidad: "kilogramos",
    //         stock: 180,
    //         lote: "L003",
    //         creationUsername: "Carlos Díaz",
    //         proveedor: "Distribuidora Norte",
    //         destino: "Depósito B",
    //     },
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
                            : "#ffaa00ff";

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
                accessorKey: "responsable",
                header: "Responsable",
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
            {
                accessorKey: "destino",
                header: "Destino",
                // enableEditing: (row) => row.original.tipo === "EGRESO",
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

    const validarCamposRegistro = (registro: Partial<Registro>) => {
        const errores: Record<string, string> = {};
        if (!registro.codigo?.trim()) errores.codigo = "Código requerido";
        if (!registro.nombre?.trim()) errores.nombre = "Nombre requerido";
        if (!registro.categoria?.trim()) errores.categoria = "Categoría requerida";
        if (!registro.marca?.trim()) errores.marca = "Marca requerida";
        if (!registro.unidad?.trim()) errores.unidad = "Medida requerida";
        if (!registro.lote?.trim()) errores.lote = "Lote requerido";
        if (!registro.proveedor?.trim()) errores.proveedor = "Proveedor requerido";
        if (!registro.destino?.trim()) errores.destino = "Destino requerido";
        if (!registro.creationUsername?.trim()) errores.creationUsername = "Unidad requerida";
        if (!registro.tipo?.trim()) errores.tipo = "Tipo requerido";
        const stockNumber = Number(registro.stock);
        if (registro.stock === undefined || registro.stock === null || isNaN(stockNumber) || stockNumber <= 0) {
            errores.stock = "Stock debe ser un número válido mayor a 0";
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
        displayColumnDefOptions: {
            'mrt-row-expand': {
                size: 0,
                header: '',
                Cell: () => null,
            },
        },
        positionExpandColumn: 'last',
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableGlobalFilter: true,
        editDisplayMode: "modal",
        enableExpandAll: false,
        // enableColumnOrdering: true,
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
                destino: false,
            },
        },
        muiExpandButtonProps: ({ row, table }) => ({
            onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
            sx: {
                transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
            },
        }),

        // Define el contenido expandido
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
                        Unidad
                    </Typography>
                    <Typography>{row.original.unidad}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2" color="primary">
                        Stock
                    </Typography>
                    <Typography>{row.original.stock}</Typography>
                </Box>
                <Box>
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
                    <Typography>{row.original.creationUsername}</Typography>
                </Box>
            </Box >
        ),
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
