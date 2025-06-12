import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ModalCrudRoles from "../../components/Modales/ModalRoles/ModalCrudRoles";
import ObtenerRoles from "../../components/CrudRoles/ObtenerRoles";
import EliminarRol from "../../components/CrudRoles/EliminarRol";
import ObtenerUsuarios from "../../components/CrudUsuarios/ObtenerUsuarios"
import { StyledTableCell, StyledTableRow } from "../../components/EstilosTablas/StyledTableCell";

const Roles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (usuarioSeleccionado) {
      cargarRoles(usuarioSeleccionado);
    } else {
      setRoles([]);
    }
  }, [usuarioSeleccionado]);

  const cargarUsuarios = async () => {
    try {
      const data = await ObtenerUsuarios();
      setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
      // Selecciona el primer usuario por defecto
      if ((Array.isArray(data) ? data : data.usuarios)?.length > 0) {
        setUsuarioSeleccionado((Array.isArray(data) ? data : data.usuarios)[0].id_usuario);
      }
    } catch  {
      setSnackbarMessage("Error al obtener los usuarios.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const cargarRoles = async (idUsuario) => {
    try {
      const data = await ObtenerRoles(idUsuario);
      // Asegura que roles siempre sea un array
      setRoles(Array.isArray(data) ? data : Array.isArray(data.roles) ? data.roles : []);
    } catch  {
      setRoles([]); // <-- Esto asegura que no se quede en null
      setSnackbarMessage("Error al obtener los roles.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEliminarRol = async (idRol) => {
    try {
      await EliminarRol(idRol);
      setRoles((prevRoles) => prevRoles.filter((rol) => rol.id_rol !== idRol));
      setSnackbarMessage("Rol eliminado con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch  {
      setSnackbarMessage("Ocurrió un error al intentar eliminar el rol.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleCloseModal = () => setOpenModal(false);

  const handleRolAsignado = async () => {
    await cargarRoles(usuarioSeleccionado);
    setSnackbarMessage("Rol asignado con éxito.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setOpenModal(false);
  };

  return (
    <Card sx={{ margin: 3, padding: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Gestión de Roles
            </Typography>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ color: "text.secondary" }}
            >
              Asigna y elimina roles de los usuarios.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
         
            disabled={!usuarioSeleccionado}
          >
            Asignar Nuevo Rol
          </Button>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="usuario-select-label">Selecciona un usuario</InputLabel>
          <Select
            labelId="usuario-select-label"
            value={usuarioSeleccionado}
            label="Selecciona un usuario"
            onChange={(e) => setUsuarioSeleccionado(e.target.value)}
          >
            {usuarios.map((usuario) => (
              <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                {usuario.usuario}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Acciones</StyledTableCell>
                <StyledTableCell align="center">Nombre del Menú</StyledTableCell>
                <StyledTableCell align="center">Nombre del Modulo</StyledTableCell>
                {/* Puedes agregar más columnas si lo necesitas */}
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell align="center" colSpan={3}>
                    No hay roles asignados a este usuario.
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                roles.map((rol) => (
                  <StyledTableRow key={rol.id_rol}>
                    <StyledTableCell align="center">
                      <Stack direction="row" justifyContent="center" spacing={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleEliminarRol(rol.id_rol)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {rol.menu_navegacion?.nombre_menu_navegacion}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {rol.menu_navegacion?.modulo.nombre_modulo}
                    </StyledTableCell>

                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <ModalCrudRoles
        open={openModal}
        onClose={handleCloseModal}
        usuarioSeleccionado={usuarioSeleccionado}
        roles={roles}
        onRolAsignado={handleRolAsignado}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default Roles;