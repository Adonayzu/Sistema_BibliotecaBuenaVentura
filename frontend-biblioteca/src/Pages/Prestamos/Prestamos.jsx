import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerTodosPrestamos from "../../components/CrudPrestamos/ObtenerTodosPrestamos";
import DevolucionLibro from "../../components/CrudPrestamos/DevolucionLibro";
import CancelarPrestamo from "../../components/CrudPrestamos/CancelarPrestamo";
import ModalCrearPrestamo from "../../components/ModalPrestamo/ModalCrearPrestamo";
import ModalActualizarPrestamo from "../../components/ModalPrestamo/ModalActualizarPrestamo";
import AddIcon from "@mui/icons-material/Add";

const Prestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalActualizar, setOpenModalActualizar] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const data = await ObtenerTodosPrestamos();
      setPrestamos(data || []);
    } catch {
      setPrestamos([]);
      setSnackbarMessage("Error al cargar los préstamos. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const refrescarPrestamos = async () => {
    cargarPrestamos();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleModificarPrestamo = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setOpenModalActualizar(true);
  };

  const handleCloseModalActualizar = () => {
    setOpenModalActualizar(false);
    setPrestamoSeleccionado(null);
  };

  const handleDevolverPrestamo = async (idPrestamo) => {
    try {
      await DevolucionLibro(idPrestamo);
      setSnackbarMessage("Préstamo devuelto exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refrescarPrestamos();
    } catch {
      setSnackbarMessage("Error al devolver el préstamo.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCancelarPrestamo = async (idPrestamo) => {
    try {
      await CancelarPrestamo(idPrestamo);
      setSnackbarMessage("Préstamo cancelado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refrescarPrestamos();
    } catch {
      setSnackbarMessage("Error al cancelar el préstamo.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  return (
    <Box sx={{ margin: 3 }}>
      <Typography
        variant="h4"
        paddingBottom={2}
        textAlign={"center"}
        component="h2"
        sx={{ fontWeight: "bold" }}
      >
        Gestión de Préstamos
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{ color: "text.secondary" }}
        >
          Préstamos registrados en el sistema.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Asignar Nuevo Préstamo
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Acciones</StyledTableCell>
              <StyledTableCell align="center">Id Préstamo</StyledTableCell>
              <StyledTableCell align="center">Cliente</StyledTableCell>
              <StyledTableCell align="center">Libro</StyledTableCell>
              <StyledTableCell align="center">Fecha Préstamo</StyledTableCell>
              <StyledTableCell align="center">Fecha Devolución</StyledTableCell>
              <StyledTableCell align="center">Observaciones</StyledTableCell>
              <StyledTableCell align="center">Estado del Libro</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamos.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={9} align="center">
                  No hay préstamos registrados.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              prestamos.map((prestamo) => (
                <StyledTableRow key={prestamo.id_prestamo}>
                  <StyledTableCell align="center">
                    <Stack
                      direction="row"
                      justifyContent={"center"}
                      spacing={1}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleModificarPrestamo(prestamo)}
                      >
                        Modificar
                      </Button>
                      {prestamo.id_estado === 1 && (
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          onClick={() =>
                            handleDevolverPrestamo(prestamo.id_prestamo)
                          }
                        >
                          Devuelto
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() =>
                          handleCancelarPrestamo(prestamo.id_prestamo)
                        }
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.id_prestamo}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.cliente.nombre} {prestamo.cliente.apellido}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.libro.titulo}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.fecha_prestamo}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.fecha_devolucion || "En espera"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.observaciones}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.estado.nombre_estado}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalCrearPrestamo
        open={openModal}
        onClose={handleCloseModal}
        onPrestamoGuardado={refrescarPrestamos}
      />

      <ModalActualizarPrestamo
        open={openModalActualizar}
        onClose={handleCloseModalActualizar}
        prestamo={prestamoSeleccionado}
        onPrestamoActualizado={refrescarPrestamos}
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
    </Box>
  );
};

export default Prestamos;