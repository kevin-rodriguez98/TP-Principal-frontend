import React, { useMemo, useState, useContext } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
} from "material-react-table";
import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ProductosContext, type Producto } from "../../Context/ProductosContext";
import SinResultados from "../SinResultados";

const TablaProductos: React.FC = () => {
  const { productos, isLoading, error, handleAddProducto, handleEditProducto, handleDeleteProducto } =
    useContext(ProductosContext)!;
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const navigate = useNavigate();

  const columns = useMemo<MRT_ColumnDef<Producto>[]>(
    () => [
      {
        header: "Código",
        accessorKey: "codigo",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.codigo,
          helperText: validationErrors.codigo,
        },
      },
      {
        header: "Nombre",
        accessorKey: "nombre",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        header: "Categoría",
        accessorKey: "categoria",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        header: "Marca",
        accessorKey: "marca",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        header: "Unidad",
        accessorKey: "unidad",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        header: "Stock",
        accessorKey: "stock",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: { required: true, type: "number" },
        
      },
      {
        header: "Lote",
        accessorKey: "lote",
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          required: true,
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
    if (producto.stock == null) errores.stock = "Stock requerido";
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
    await handleEditProducto(values.codigo, values);
    exitEditingMode();
  };

  const openDeleteConfirmModal = (codigo: string) => {
    handleDeleteProducto(codigo);
  };

  const table = useMaterialReactTable({
    columns,
    data: productos,
    enableEditing: true,
    enableRowActions: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
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
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row.original.codigo)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Nuevo Producto</DialogTitle>
        <DialogContent sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <MRT_EditActionButtons table={table} row={row} color="primary" />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <MRT_EditActionButtons table={table} row={row} color="primary" />
        </DialogActions>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          sx={{
            backgroundColor: "#2b2b2b",
            color: "#fff",
            borderRadius: "30px",
            "&:hover": { backgroundColor: "#444" },
          }}
        >
          <IoArrowBackCircleSharp size={24} style={{ marginRight: 6 }} />
          Volver
        </Button>
        <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
          ➕ Nuevo Producto
        </Button>
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h5" color="primary">
            🧪 Lista de Productos
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
    state: { isLoading },
  });

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );

  return <MaterialReactTable table={table} />;
};

export default TablaProductos;