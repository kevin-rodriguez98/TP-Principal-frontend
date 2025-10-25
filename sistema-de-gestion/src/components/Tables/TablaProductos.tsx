import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_EditActionButtons, type MRT_Row, } from "material-react-table";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ProductosContext, type Producto } from "../../Context/ProductosContext";
import SinResultados from "../SinResultados";
import { RecetaContext } from "../../Context/RecetaContext";


const TablaProductos: React.FC = () => {
  const { productos, isLoading, error, handleAddProducto, handleEditProducto, handleDeleteProducto } = useContext(ProductosContext)!;
  const { recetas, obtenerInsumosNecesarios, agregarInsumoAReceta } = useContext(RecetaContext)!;
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const navigate = useNavigate();



  // 1️⃣ Estados adicionales
  const [openAgregarInsumo, setOpenAgregarInsumo] = useState(false);
  const [insumoCodigo, setInsumoCodigo] = useState("");
  const [insumoCantidad, setInsumoCantidad] = useState<number>(0);
  const [productoParaAgregar, setProductoParaAgregar] = useState<string | null>(null);

  // 2️⃣ Función para abrir el modal
  const handleAbrirAgregarInsumo = (codigoProducto: string) => {
    setProductoParaAgregar(codigoProducto);
    setInsumoCodigo("");
    setInsumoCantidad(0);
    setOpenAgregarInsumo(true);
  };

  // 3️⃣ Función para enviar el formulario
  const handleEnviarInsumo = async () => {
    if (!insumoCodigo.trim() || insumoCantidad <= 0) return alert("Completa los datos correctamente");
    if (productoParaAgregar) {
      await agregarInsumoAReceta(productoParaAgregar, insumoCodigo, insumoCantidad);
      setOpenAgregarInsumo(false);
    }
  };


  const columns = useMemo<MRT_ColumnDef<Producto>[]>(
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
        enableEditing: (row) => row.original.nombre === "",
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
        enableEditing: (row) => row.original.categoria === "",
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
        enableEditing: (row) => row.original.marca === "",
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
        enableEditing: (row) => row.original.unidad === "",
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
        enableEditing: (row) => row.original.lote === "",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.lote,
          helperText: validationErrors.lote ? (
            <span style={{ color: "red" }}>{validationErrors.lote}</span>
          ) : null,
          onFocus: () => setValidationErrors({ ...validationErrors, lote: undefined }),
        },
      },
    ],
    [validationErrors]
  );

  const validarProducto = (producto: Partial<Producto>) => {
    const errores: Record<string, string> = {};
    if (!producto.codigo?.trim()) errores.codigo = "Código requerido";
    if (!producto.nombre?.trim()) errores.nombre = "Nombre requerido";
    if (!producto.categoria?.trim()) errores.categoria = "Categoría requerida";
    if (!producto.marca?.trim()) errores.marca = "Marca requerida";
    if (!producto.unidad?.trim()) errores.unidad = "Unidad requerida";
    const stockNumber = Number(producto.stock);
    if (producto.stock === undefined || producto.stock === null || isNaN(stockNumber) || stockNumber <= 0) {
      errores.stock = "Stock debe ser un número válido mayor a 0";
    }
    if (!producto.lote?.trim()) errores.lote = "Lote requerido";
    return errores;
  };

  const handleCrearProducto = async ({ values, table }: any) => {
    const errores = validarProducto(values);
    if (Object.keys(errores).length > 0) {
      setValidationErrors(errores);
      return;
    }
    setValidationErrors({});
    await handleAddProducto(values);
    table.setCreatingRow(null);
  };

  const handleEditarProducto = async ({ values, exitEditingMode }: any) => {
    const errores = validarProducto(values);
    if (Object.keys(errores).length > 0) {
      setValidationErrors(errores);
      return;
    }
    setValidationErrors({});
    await handleEditProducto(values);
    exitEditingMode();
  };

  const openDeleteConfirmModal = (row: MRT_Row<Producto>) => {
    handleDeleteProducto(row.original.codigo);
  };

  const table = useMaterialReactTable({
    columns,
    data: productos,
    enableColumnResizing: true,
    columnResizeMode: 'onEnd',
    createDisplayMode: "modal",
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableGlobalFilter: true,
    editDisplayMode: "modal",
    enableEditing: true,
    enableExpandAll: false,
    positionExpandColumn: 'last',
    defaultColumn: {
      minSize: 80, //allow columns to get smaller than default
      // size: 110, //make columns wider by default
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
        lote: false,
        unidad: false,
        stock: false,
        nombre: false,
      },
    },
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
    onCreatingRowSave: handleCrearProducto,
    onEditingRowSave: handleEditarProducto,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Ver Receta">
          <IconButton
            color="success"
            onClick={async () => {
              const codigo = row.original.codigo;
              const cantidad = row.original.stock;
              await obtenerInsumosNecesarios(codigo, cantidad);
              setProductoSeleccionado(codigo);
              row.toggleExpanded();
            }}
          >
            🧾
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
          Nuevo Producto
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
        <DialogTitle
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
        >
          Editar Producto
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
          <MRT_EditActionButtons
            table={table}
            row={row}
            // variant="contained"
            color="primary"
          />
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
          <span className="texto-boton">Nueva Producto</span>
          <span className="icono-boton">➕</span>
        </Button>
        <Box sx={{ flexGrow: 1, textAlign: 'center', minWidth: 80 }}>
          <Typography variant="h5" color="primary" className="titulo-lista-insumos">
            Lista de Productos
          </Typography>
        </Box>
      </Box>
    ),
    renderEmptyRowsFallback: () =>
      error ? (
        <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />
      ) : (
        <SinResultados mensaje="No hay productos disponibles para mostrar." />
      ),
    renderDetailPanel: ({ row }) => {
      if (row.original.codigo !== productoSeleccionado) return null;

      return (
        <Box
          sx={{
            mt: 1,
            p: 2,
            backgroundColor: "#2b2b2b",
            borderRadius: "10px",
            color: "#fff",
            width: "100%",
          }}
        >
          <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
            🧾 Receta para {row.original.nombre}
          </Typography>

          {recetas.length === 0 ? (
            <Typography>No hay receta disponible.</Typography>
          ) : (
            <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
              {recetas.map((insumo) => (
                <li key={insumo.codigoInsumo} style={{ marginBottom: "8px" }}>
                  <Typography variant="body2">
                    <strong>{insumo.nombre}</strong> — {insumo.stockNecesario} unidades necesarias
                  </Typography>
                </li>
              ))}
            </Box>
          )}

          <Tooltip title="Agregar Insumo a Receta">
            <IconButton
              color="secondary"
              onClick={() => handleAbrirAgregarInsumo(row.original.codigo)}
            >
              ➕
            </IconButton>
          </Tooltip>

        </Box>
      );
    },

    state: { isLoading },
  });

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );


  return (
    <>
      {/* Modal para agregar insumo */}
      <Dialog open={openAgregarInsumo} onClose={() => setOpenAgregarInsumo(false)}>
        <DialogTitle>Agregar Insumo a Receta</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Código del Insumo"
            value={insumoCodigo}
            onChange={(e) => setInsumoCodigo(e.target.value)}
            fullWidth
          />
          <TextField
            label="Cantidad necesaria"
            type="number"
            value={insumoCantidad}
            onChange={(e) => setInsumoCantidad(Number(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAgregarInsumo(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEnviarInsumo}>Agregar</Button>
        </DialogActions>
      </Dialog>

      {/* Tabla principal */}
      <MaterialReactTable table={table} />
    </>
  );
};

export default TablaProductos;