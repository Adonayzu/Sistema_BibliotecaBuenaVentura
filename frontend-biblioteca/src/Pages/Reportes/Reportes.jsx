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
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/EstilosTablas/StyledTableCell";
import ObtenerPrestamosDevueltos from "../../components/CrudPrestamos/ObtenerPrestamosDevueltos";

const Reportes = () => {
  const [prestamosDevueltos, setPrestamosDevueltos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    cargarPrestamosDevueltos();
  }, []);

  const cargarPrestamosDevueltos = async () => {
    try {
      const data = await ObtenerPrestamosDevueltos();
      setPrestamosDevueltos(data || []);
    } catch {
      setPrestamosDevueltos([]);
      setSnackbarMessage("Error al cargar los préstamos devueltos. Intente nuevamente.");
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
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{ color: "text.secondary" }}
        >
          Lista de préstamos que han sido devueltos.
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
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
            {prestamosDevueltos.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  No hay préstamos devueltos registrados.
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
                    {prestamo.fecha_prestamo}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {prestamo.fecha_devolucion || "Sin fecha"}
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