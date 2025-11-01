import React, { useMemo, useState, useContext } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, MRT_EditActionButtons, type MRT_Row, } from "material-react-table";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { ProductosContext, type Producto } from "../../../Context/ProductosContext";
import SinResultados from "../../SinResultados";
import { RecetaContext } from "../../../Context/RecetaContext";
import { TiempoProduccionContext } from "../../../Context/TiempoProduccionContext";

const TablaProductos: React.FC = () => {
  const { productos, isLoading, error, handleAddProducto, handleEditProducto, handleDeleteProducto} = useContext(ProductosContext)!;
  const { recetas, obtenerInsumosNecesarios, agregarInsumoAReceta } = useContext(RecetaContext)!;
  const { agregarTiempoProduccion, obtenerTiempoProduccionUnitario, tiempoProduccionUnitario} = useContext(TiempoProduccionContext)!;
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [openModalReceta, setOpenModalReceta] = useState(false);
  const [codigoProducto, setCodigoProducto] = useState("");
  const [nuevoInsumo, setNuevoInsumo] = useState({ codigoInsumo: "", stockNecesarioInsumo: 0, });

  const navigate = useNavigate();

  const columns = useMemo<MRT_ColumnDef<Producto>[]>(
    () => [
      {
        accessorKey: "codigo",
        header: "Código",
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
        enableEditing: false,
        defaultValue: 0,
        muiTableHeadCellProps: { style: { color: "#15a017ff" } },
        muiEditTextFieldProps: {
          type: "number",
          error: !!validationErrors.stock,
          helperText: validationErrors.stock ? (
            <span style={{ color: "red" }}>{validationErrors.stock}</span>
          ) : null,
          onFocus: () => setValidationErrors({ ...validationErrors, stock: undefined }),
        },
      }
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

  const handleTiempoProduccion = (row: MRT_Row<Producto>) => {
    obtenerTiempoProduccionUnitario(row.original.codigo);
  }

  const table = useMaterialReactTable({
    columns,
    data: productos,
    createDisplayMode: "modal",
    enableRowActions: true,
    positionActionsColumn: 'last',
    enableGlobalFilter: true,
    editDisplayMode: "modal",
    enableEditing: true,
    positionExpandColumn: 'last',
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
              await obtenerInsumosNecesarios(row.original.codigo, row.original.stock);
              await handleTiempoProduccion(row);
              setProductoSeleccionado(row.original.codigo);
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
            width: "50%",
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
                    <strong>{insumo.nombreInsumo}</strong> — Cantidad: {insumo.cantidadNecesaria}
                  </Typography>
                </li>

              ))}
              <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                Tiempo de produccion unitario: {tiempoProduccionUnitario} hs.
              </Typography>
            </Box>
          )}

          <Tooltip title="Agregar Insumo a Receta">
            <IconButton
              color="secondary"
              onClick={() => {
                setCodigoProducto(row.original.codigo);
                setNuevoInsumo({ codigoInsumo: "", stockNecesarioInsumo: 1 });
                setOpenModalReceta(true);
              }}
            >
              ➕
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar tiempo de producción">
            <IconButton
              color="secondary"
              onClick={() => {
                const tiempo = prompt("Ingrese el tiempo de producción (en minutos):");
                if (tiempo) {
                  agregarTiempoProduccion(row.original.codigo, parseInt(tiempo));
                }
              }}
            >
              ⏱️
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
      <MaterialReactTable table={table} />
      <Dialog
        open={openModalReceta}
        onClose={() => setOpenModalReceta(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: "bold", color: "#1976d2", textAlign: "center" }}
        >
          Agregar Insumo a Receta
        </DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, padding: 2 }}>
          <TextField
            label="Código del Producto"
            value={codigoProducto}
            disabled
            fullWidth
          />
          <TextField
            label="Código del Insumo"
            value={nuevoInsumo.codigoInsumo}
            onChange={(e) =>
              setNuevoInsumo({ ...nuevoInsumo, codigoInsumo: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Cantidad Necesaria"
            type="number"
            value={nuevoInsumo.stockNecesarioInsumo}
            onChange={(e) =>
              setNuevoInsumo({
                ...nuevoInsumo,
                stockNecesarioInsumo: Number(e.target.value),
              })
            }
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await agregarInsumoAReceta(
                codigoProducto,
                nuevoInsumo.codigoInsumo,
                nuevoInsumo.stockNecesarioInsumo
              );
              setOpenModalReceta(false);
            }}
          >
            Guardar
          </Button>
          <Button onClick={() => setOpenModalReceta(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default TablaProductos;