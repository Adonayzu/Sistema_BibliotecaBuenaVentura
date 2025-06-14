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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCrudUsurio from "../../components/Modales/ModalUsuario/ModalCrudUsuario";
import EliminarUsuario from "../../components/CrudUsuarios/EliminarUsuario";
import ObtenerUsuarios from "../../components/CrudUsuarios/ObtenerUsuarios";
import { StyledTableCell, StyledTableRow } from "../../components/EstilosTablas/StyledTableCell";


const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await ObtenerUsuarios();
      setUsuarios(Array.isArray(data) ? data : data.usuarios || []);
    } catch {
      setSnackbarMessage("Error al obtener los usuarios.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUsuarioCreado = async () => {
    await cargarUsuarios();
  };

  const handleEliminarUsuario = async (idUsuario) => {
    try {
      await EliminarUsuario(idUsuario);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((usuario) => usuario.id_usuario !== idUsuario)
      );
      setSnackbarMessage("Usuario eliminado con éxito.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage("Ocurrió un error al intentar eliminar el usuario.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUsuarioSeleccionado(null);
  };



  return (
    <Box>
      <Card sx={{ margin: 3, padding: 2, maxWidth: "100%", width: "100%" }}>
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
                Listado de Usuarios
              </Typography>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{ color: "text.secondary" }}
              >
                Usuarios registrados en el sistema.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              sx={{ backgroundColor: "#388e3c" }}
              onClick={() => {
                setUsuarioSeleccionado(null);
                setOpenModal(true);
              }}
            >
              Crear Nuevo Usuario
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Acciones</StyledTableCell>
                  <StyledTableCell align="center">Id Usuario</StyledTableCell>
                  <StyledTableCell align="center">Usuario</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario) => (
                  <StyledTableRow key={usuario.id_usuario}>
                    <StyledTableCell align="center">
                      <Stack direction="row" justifyContent="center" spacing={1}>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setUsuarioSeleccionado(usuario);
                            setOpenModal(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleEliminarUsuario(usuario.id_usuario)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {usuario.id_usuario}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {usuario.usuario}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        <ModalCrudUsurio
          open={openModal}
          onClose={handleCloseModal}
          onUsuarioCreado={handleUsuarioCreado}
          usuario={usuarioSeleccionado}
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
    </Box>
  );
};

export default Usuarios;