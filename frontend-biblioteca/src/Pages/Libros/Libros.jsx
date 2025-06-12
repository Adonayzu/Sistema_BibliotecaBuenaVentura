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
import CrearActualizarLibro from "../../components/ModalLibro/CrearActualizarLibro";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ObtenerLibros from "../../components/CrudLibros/ObtenerLibros";
import EliminarLibro from "../../components/CrudLibros/EliminarLibro";

const ITEMS_PER_PAGE = 5;

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    cargarLibros();
  }, [currentPage]);

  const cargarLibros = async () => {
    try {
      const data = await ObtenerLibros();
      setLibros(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / ITEMS_PER_PAGE));
    } catch {
      setLibros([]);
      setSnackbarMessage("Error al cargar los libros. Intente nuevamente.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenModal = (libro = null) => {
    setLibroSeleccionado(libro);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setLibroSeleccionado(null);
  };

  const refrescarLibros = async () => {
    cargarLibros();
  };

  const handleEliminarLibro = async (libroId) => {
    try {
      await EliminarLibro(libroId);
      setSnackbarMessage("Libro eliminado exitosamente.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refrescarLibros();
    } catch {
      setSnackbarMessage("Error al eliminar el libro.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const librosPaginados = libros.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ margin: 3 }}>
      <Typography variant="h4" paddingBottom={2} textAlign={"center"} component="h2" sx={{ fontWeight: "bold" }}>
        Gestión de Libros
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
          Libros registrados en el sistema.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Agregar Nuevo Libro
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Acciones</StyledTableCell>
              <StyledTableCell align="center">Id Libro</StyledTableCell>
              <StyledTableCell align="center">Título</StyledTableCell>
              <StyledTableCell align="center">Autor</StyledTableCell>
              <StyledTableCell align="center">Editorial</StyledTableCell>
              <StyledTableCell align="center">Año</StyledTableCell>
              <StyledTableCell align="center">ISBN</StyledTableCell>
              <StyledTableCell align="center">Cantidad Disponible</StyledTableCell>
              <StyledTableCell align="center">Cantidad Total</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {librosPaginados.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No hay libros registrados.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              librosPaginados.map((libro) => (
                <StyledTableRow key={libro.id_libro}>
                  <StyledTableCell align="center">
                    <Stack direction="row" justifyContent={"center"} spacing={1}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenModal(libro)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleEliminarLibro(libro.id_libro)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                  <StyledTableCell align="center">{libro.id_libro}</StyledTableCell>
                  <StyledTableCell align="center">{libro.titulo}</StyledTableCell>
                  <StyledTableCell align="center">{libro.nombre_autor}</StyledTableCell>
                  <StyledTableCell align="center">{libro.nombre_editorial || "N/A"}</StyledTableCell>
                  <StyledTableCell align="center">{libro.anio_publicacion || "N/A"}</StyledTableCell>
                  <StyledTableCell align="center">{libro.isbn}</StyledTableCell>
                  <StyledTableCell align="center">{libro.cantidad_disponible}</StyledTableCell>
                  <StyledTableCell align="center">{libro.cantidad_total}</StyledTableCell>
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

      <CrearActualizarLibro
        open={openModal}
        onClose={handleCloseModal}
        libro={libroSeleccionado}
        onLibroGuardado={refrescarLibros}
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

export default Libros;