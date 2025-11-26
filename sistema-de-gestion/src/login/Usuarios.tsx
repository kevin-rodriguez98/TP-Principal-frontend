import React, { useState, useMemo } from "react";
import {
  Box, Button, DialogActions, DialogContent, DialogTitle,
  Typography, CircularProgress,
  Paper,
  Tooltip,
  IconButton
} from "@mui/material";

import * as XLSX from "xlsx";
import {
  MaterialReactTable,
  MRT_EditActionButtons,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { useUsuarios, type Empleado } from "../Context/UsuarioContext";
import SinResultados from "../components/estaticos/SinResultados";
import '../styles/tablas.css'
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { EditIcon } from "lucide-react";


const ESTILOS_CABECERA = { style: { color: "#b13c7e" } };
const roles = ["GERENTE", "SUPERVISOR", "ADMINISTRADOR", "OPERARIO"];


const TablaUsuarios: React.FC = () => {
  const { empleados, usuario, cargando, agregarEmpleado, error, logout, isLoading, eliminarEmpleado, modificarEmpleado } = useUsuarios();
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const navigate = useNavigate();
  const limpiarError = (campo: string) =>
    setValidationErrors((prev) => ({ ...prev, [campo]: undefined }));

const baseTextFieldProps = (campo: string, extraProps = {}) => ({
  error: !!validationErrors[campo],
  helperText: validationErrors[campo] ? (
    <span style={{ color: "#b13c7e" }}>{validationErrors[campo]}</span>
  ) : null,
  onFocus: () => limpiarError(campo),
  ...extraProps,
});



  /** ------------------------------------------------------------------
   * COLUMNAS DE LA TABLA
   * ------------------------------------------------------------------ */
  const columns = useMemo<MRT_ColumnDef<Empleado>[]>(() => [
    {
      accessorKey: "legajo",
      header: "Legajo",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("legajo"),
      enableEditing: (row: any) => !row?.original?.legajo,
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("nombre"),
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("apellido"),
    },
    {
      accessorKey: "area",
      header: "Área",
      muiTableHeadCellProps: ESTILOS_CABECERA,
      muiEditTextFieldProps: baseTextFieldProps("area"),
    },
    {
  accessorKey: "rol",
  header: "Rol",
  editVariant: "select",
  editSelectOptions: roles,
  muiTableHeadCellProps: ESTILOS_CABECERA,
  muiEditTextFieldProps: ({ row }) => ({
    ...baseTextFieldProps("rol"),
    select: true,
    value: row._valuesCache?.rol ?? row.original.rol,  // <-- ESTA ES LA CLAVE
    onChange: (e) => {
      row._valuesCache.rol = e.target.value; // hace controlado al input
    }
  }),
},
  ], [validationErrors]);

  /** ------------------------------------------------------------------
 * GUARDAR NUEVO EMPLEADO
 * ------------------------------------------------------------------ */
const handleGuardar = async ({ values, table }: any) => {
  const nuevo = {
    ...values,
    legajo: values.legajo.toUpperCase(),
    nombre: values.nombre.toUpperCase(),
    apellido: values.apellido.toUpperCase(),
    area: values.area?.toUpperCase() ?? "",
    rol: values.rol.toUpperCase(),
  };

  const errores = validarUsuario(nuevo);
  if (Object.keys(errores).length) {
    setValidationErrors(errores);
    return;
  }

  setValidationErrors({});
  await agregarEmpleado(nuevo);
  table.setCreatingRow(null);
};

const handleEditar = async ({ values, table }: any) => {
  const usuarioEditado = {
    ...values,
    legajo: values.legajo.toUpperCase(),
    nombre: values.nombre.toUpperCase(),
    apellido: values.apellido.toUpperCase(),
    area: values.area?.toUpperCase() ?? "",
    rol: values.rol.toUpperCase(),
  };

  const errores = validarUsuario(usuarioEditado);

  if (Object.keys(errores).length) {
    setValidationErrors(errores);
    return;
  }

  setValidationErrors({});

  await modificarEmpleado(usuarioEditado);

  table.setEditingRow(null);
};

  /** ------------------------------------------------------------------
   * LOGIN SIMULADO
   * ------------------------------------------------------------------ */
  // const handleLoginSimulado = async (u: Empleado) => {
  //   await login(u.legajo, `${u.nombre} ${u.apellido}`);
  //   alert(`👤 Usuario autenticado: ${u.nombre} ${u.apellido}`);
  // };

  /** ------------------------------------------------------------------
   * EXPORTACIÓN EXCEL
   * ------------------------------------------------------------------ */
  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(empleados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "usuarios.xlsx");
  };

  /** ------------------------------------------------------------------
 * VALIDACIÓN
 * ------------------------------------------------------------------ */
  const validarUsuario = (u: Partial<Empleado>) => {
    const errores: Record<string, string> = {};
    if (!u.legajo?.trim()) errores.legajo = "Legajo requerido";
    if (!u.nombre?.trim()) errores.nombre = "Nombre requerido";
    if (!u.apellido?.trim()) errores.apellido = "Apellido requerido";
    if (!u.rol?.trim()) errores.rol = "Rol requerido";
    return errores;
  };

  /** ------------------------------------------------------------------
   * CONFIGURACIÓN DE LA TABLA
   * ------------------------------------------------------------------ */
  const table = useMaterialReactTable({
    columns,
    data: empleados,
    createDisplayMode: "modal",
    enableRowActions: true,
    enableGlobalFilter: true,
    editDisplayMode: "modal",
    enableEditing: true,
    positionActionsColumn: "last",
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0
      },
      density: "compact",
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
    getRowId: (row) => row.legajo,

    // Crear nuevo usuario
    onCreatingRowSave: handleGuardar,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditar,

    // Modal de creación
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle
          variant="h5"
          sx={{ fontWeight: "bold", color: "#b13c7e", textAlign: "center" }}
        >
          Nuevo Usuario
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

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <MRT_EditActionButtons table={table} row={row} />
        </DialogActions>
      </>
    ),

    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
  <>
    <DialogTitle
      variant="h5"
      sx={{ fontWeight: "bold", color: "#b062ceff", textAlign: "center" }}
    >
      Editar Usuario
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

    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
      <MRT_EditActionButtons table={table} row={row} />
    </DialogActions>
  </>
),

    /** ---- BOTONES SUPERIORES ---- */
    renderTopToolbarCustomActions: ({ table }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#0e1217 ",
      borderRadius: "12px",
      padding: "10px 16px",
      boxShadow: "0 0 10px rgba(17, 14, 25, 0.3)",
      mb: 1,
    }}
  >
    {/* --- BOTONES IZQUIERDA --- */}
    <Box display="flex" alignItems="center" gap={2}>
      <Button
        onClick={() => navigate("/")}
        variant="contained"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#111827",
          color: "#fff",
          borderRadius: "30px",
          padding: "8px 16px",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#0c111cff" },
        }}
      >
        <IoArrowBackCircleSharp size={28} style={{ color: "#ff4b4b" }} />
      </Button>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#d88346ff" }}
        onClick={() => table.setCreatingRow(true)}
      >
        Nuevo Usuario
      </Button>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#f1c40f" }}
        onClick={exportarExcel}
      >
        Descargar Listado
      </Button>
    </Box>

    {/* --- USUARIO DERECHA --- */}
    <Box display="flex" alignItems="center" gap={1}>
      {usuario ? (
        <>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              backgroundColor: "#0e1217",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.1rem",
            }}
          >
            {usuario.nombre?.charAt(0).toUpperCase()}
          </Box>

          <Box mr={1}>
            <Typography sx={{ fontSize: "0.8rem", color: "gray" }}>
              Sesión activa
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "green",
              }}
            >
              {usuario.nombre}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={logout}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              padding: "4px 10px",
            }}
          >
            Cerrar
          </Button>
        </>
      ) : (
        <Typography color="text.secondary">
          ⚪ Sin usuario autenticado
        </Typography>
      )}
    </Box>
  </Box>
),

    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Modificar">
          <IconButton
            color="primary"
            onClick={() => table.setEditingRow(row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={async () =>  await eliminarEmpleado(row.original.legajo)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderEmptyRowsFallback: () =>
      error ? (
        <SinResultados mensaje="El servidor no está disponible. Intenta más tarde." />
      ) : (
        <SinResultados mensaje="No hay usuarios disponibles." />
      ),

    state: { isLoading },
  });

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        p: 4,
      }}
    >
  <Paper
  elevation={3}
  sx={{
    width: "100%",
    maxWidth: "1400px",
    borderRadius: 2,
    p: 3,
    backgroundColor: "#0e1217",
  }}
>
  <Typography
    variant="h4"
    sx={{
      fontWeight: "bold",
      color: "#b13c7e",
      mb: 3,
      textAlign: "center",
    }}
  >
    Panel de Usuarios
  </Typography>

  <MaterialReactTable table={table} />
</Paper>
    </Box>
  );


};

export default TablaUsuarios;
