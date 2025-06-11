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
  Snackbar,
  Alert,
  TextField,
  Button,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerPrestamosDevueltos from "../../components/CrudPrestamos/ObtenerPrestamosDevueltos";

const Reportes = () => {
  const [prestamosDevueltos, setPrestamosDevueltos] = useState([]);
  const [isbn, setIsbn] = useState("");
  const [titulo, setTitulo] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const cargarPrestamosDevueltos = async () => {
    try {
      const params = {};
      if (isbn) params.isbn = isbn;
      if (titulo) params.titulo = titulo;
      if (nombreCliente) params.nombre_cliente = nombreCliente;

      const data = await ObtenerPrestamosDevueltos(params);
      setPrestamosDevueltos(data || []);
    } catch {
      setPrestamosDevueltos([]);
      setSnackbarMessage(
        "Error al cargar los préstamos devueltos. Intente nuevamente."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleBuscar = () => {
    cargarPrestamosDevueltos();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    cargarPrestamosDevueltos();
  }, []);

  return (
    <Box sx={{ margin: 3 }}>
      <Typography
        variant="h4"
        paddingBottom={2}
        textAlign={"center"}
        component="h2"
        sx={{ fontWeight: "bold" }}
      >
        Reporte de Préstamos Devueltos
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <TextField
          label="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Nombre del Cliente"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleBuscar}>
          Buscar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.location.reload()} // esto recarga la página
        >
          Cancelar Búsqueda
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Id Préstamo</StyledTableCell>
              <StyledTableCell align="center">Cliente</StyledTableCell>
              <StyledTableCell align="center">Libro</StyledTableCell>
              <StyledTableCell align="center">ISBN</StyledTableCell>
              <StyledTableCell align="center">Fecha Préstamo</StyledTableCell>
              <StyledTableCell align="center">Fecha Devolución</StyledTableCell>
              <StyledTableCell align="center">Observaciones</StyledTableCell>
              <StyledTableCell align="center">Estado del Libro</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prestamosDevueltos.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No se encontraron préstamos devueltos.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              prestamosDevueltos.map((prestamo) => (
                <StyledTableRow key={prestamo.id_prestamo}>
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
                    {prestamo.libro.isbn}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.fecha_prestamo}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.fecha_devolucion}
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

export default Reportes;
