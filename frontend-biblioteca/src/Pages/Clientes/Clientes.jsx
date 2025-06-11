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
  IconButton,
  Button,
  Snackbar,
  Alert,
  Stack,
  Pagination,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/EstilosTablas/StyledTableCell";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ObtenerClientes from "../../components/crudClientes/ObtenerClientes";
import EliminarCliente from "../../components/crudClientes/EliminarCliente";
import ModalCrearActualizarCliente from "../../components/ModalClietne/ModalCrearActualizarCliente";

const ITEMS_PER_PAGE = 5;

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    cargarClientes();
  }, [currentPage]);

  const cargarClientes = async () => {
    try {
      const data = await ObtenerClientes();
      setClientes(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / ITEMS_PER_PAGE));
    } catch {
      setClientes([]);
      setSnackbarMessage("Error al cargar los clientes. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenModal = (cliente = null) => {
    setClienteSeleccionado(cliente);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setClienteSeleccionado(null);
  };

  const refrescarClientes = async () => {
    cargarClientes();
  };

  const handleEliminarCliente = async (idCliente) => {
    try {
      await EliminarCliente(idCliente);
      setSnackbarMessage("Cliente eliminado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refrescarClientes();
    } catch {
      setSnackbarMessage("Error al eliminar el cliente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const clientesPaginados = clientes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ margin: 3 }}>
      <Typography variant="h4" paddingBottom={2} textAlign={"center"} component="h2" sx={{ fontWeight: "bold" }}>
        Gestión de Clientes
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
          Clientes registrados en el sistema.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Agregar Nuevo Cliente
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Acciones</StyledTableCell>
              <StyledTableCell align="center">Id Cliente</StyledTableCell>
              <StyledTableCell align="center">Nombre Completo</StyledTableCell>
              <StyledTableCell align="center">Correo Electrónico</StyledTableCell>
              <StyledTableCell align="center">Número de Identificación</StyledTableCell>
              <StyledTableCell align="center">Teléfono</StyledTableCell>
              <StyledTableCell align="center">Dirección</StyledTableCell>
              <StyledTableCell align="center">Fecha de Ingreso</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientesPaginados.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={3} align="center">
                  No hay clientes registrados.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              clientesPaginados.map((cliente) => (
                <StyledTableRow key={cliente.id_cliente}>
                  <StyledTableCell align="center">
                    <Stack direction="row" justifyContent={"center"} spacing={1}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(cliente)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleEliminarCliente(cliente.id_cliente)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center">{cliente.id_cliente}</StyledTableCell>
                  <StyledTableCell align="center">{cliente.nombre + " " + cliente.apellido}</StyledTableCell>
                  <StyledTableCell align="center">{cliente.correo}</StyledTableCell>
                  <StyledTableCell align="center">{cliente.numero_identificacion}</StyledTableCell>
                  <StyledTableCell align="center">{cliente.telefono}</StyledTableCell>
                  <StyledTableCell align="center">{cliente.direccion}</StyledTableCell>
                  <StyledTableCell align="center">{cliente.fecha_registro}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>

      <ModalCrearActualizarCliente
        open={openModal}
        onClose={handleCloseModal}
        cliente={clienteSeleccionado}
        onClienteGuardado={refrescarClientes}
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

export default Clientes;