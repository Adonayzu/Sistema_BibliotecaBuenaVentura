'use client'
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Modal,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import { toast } from "sonner";

const PALETTE = {
  background: "#f5f6fa",
  paper: "#fff",
  blue: "#3b82f6",
  blueDark: "#2563eb",
  gray: "#6b7280",
};

/* interface Prestamos {
  id: number
  idCliente: number
  idProducto: number
  fechaPrestamo: string
  fechaDevolucion: string | null
  estado: 'prestado' | 'devuelto'

interface Clientes {
  id: number
  nombre: string
}

interface Producto {
  id: number
  nombre: string
  disponible: number
} */

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [libros, setLibros] = useState([]);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    idCliente: '',
    idLibro: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("")

  useEffect(() => {
    fetch('/api/prestamos').then(r => r.json()).then(setPrestamos)
    fetch('/api/clientes').then(r => r.json()).then(setClientes)
    fetch('/api/libros').then(r => r.json()).then(setLibros)
  }, [])

  const handleCrearPrestamo = async () => {
    const { idCliente, idLibro } = nuevoPrestamo

    if (!idCliente || !idLibro) {
      setModalMessage("Todos los campos son obligatorios")
      setModalVisible(true)
      return
    }

    const libro = libros.find(l => l.id === Number(idLibro))
    if (!libro || libro.cantidad <= 0) {
      setModalMessage("Libro no disponible")
      setModalVisible(true)
      return
    }

    const res = await fetch('/api/prestamos', {
      method: 'POST',
      body: JSON.stringify({ idCliente, idLibro }),
    })

    if (res.ok) {
      toast.success('Préstamo creado')
      setNuevoPrestamo({ idCliente: '', idLibro: '' })
      const actualizados = await fetch('/api/prestamos').then(r => r.json())
      setPrestamos(actualizados)
      setModalMessage("Préstamo creado correctamente")
      setModalVisible(true)
    } else {
      toast.error('Error al crear préstamo')
    }
  }

  const handleDevolver = async (id) => {
    const res = await fetch(`/api/prestamos/${id}/devolver`, {
      method: 'POST',
    });

    if (res.ok) {
      toast.success('Préstamo devuelto');
      const actualizados = await fetch('/api/prestamos').then(r => r.json());
      setPrestamos(actualizados);
      setModalMessage("Préstamo devuelto correctamente");
      setModalVisible(true);
    } else {
      toast.error('Error al devolver préstamo');
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: PALETTE.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          maxWidth: 600,
          px: 2,
        }}
      >
        {/* Formulario */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            backgroundColor: PALETTE.paper,
            boxShadow: "0 2px 16px 0 rgba(60,72,88,0.07)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: PALETTE.blue, fontWeight: 700 }}
          >
            Gestión de Préstamos
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: PALETTE.gray }}>Cliente</InputLabel>
                <Select
                  value={nuevoPrestamo.idCliente}
                  label="Cliente"
                  onChange={(e) =>
                    setNuevoPrestamo((p) => ({
                      ...p,
                      idCliente: e.target.value,
                    }))
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: PALETTE.blue,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Selecciona un cliente</em>
                  </MenuItem>
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel sx={{ color: PALETTE.gray }}>Libro</InputLabel>
                <Select
                  value={nuevoPrestamo.idLibro}
                  label="Libro"
                  onChange={(e) =>
                    setNuevoPrestamo((p) => ({
                      ...p,
                      idLibro: e.target.value,
                    }))
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: PALETTE.blue,
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Selecciona un libro</em>
                  </MenuItem>
                  {libros.map((l) => (
                    <MenuItem key={l.id} value={l.id}>
                      {l.titulo} ({l.cantidad} disponibles)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCrearPrestamo}
              sx={{
                backgroundColor: PALETTE.blue,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: 1,
                "&:hover": {
                  backgroundColor: PALETTE.blueDark,
                },
              }}
            >
              Crear Préstamo
            </Button>
          </Box>
        </Paper>

        {/* Lista de préstamos */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width: "100%" }}>
          <Typography variant="h5" sx={{ color: PALETTE.blue, mb: 2 }}>
            Préstamos Registrados
          </Typography>
          {prestamos.length === 0 ? (
            <Typography color="text.secondary">No hay préstamos registrados.</Typography>
          ) : (
            <Stack spacing={2}>
              {prestamos.map((p) => (
                <Paper
                  key={p.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography>
                      <strong>ID:</strong> {p.id}
                    </Typography>
                    <Typography>
                      <strong>Cliente:</strong>{" "}
                      {clientes.find((c) => c.id === p.idCliente)?.nombre}
                    </Typography>
                    <Typography>
                      <strong>Libro:</strong>{" "}
                      {libros.find((lb) => lb.id === p.idLibro)?.titulo}
                    </Typography>
                    <Typography>
                      <strong>Fecha Préstamo:</strong>{" "}
                      {new Date(p.fechaPrestamo).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Estado:</strong> {p.estado}
                    </Typography>
                  </Box>
                  {p.estado === "prestado" && (
                    <Button
                      variant="outlined"
                      onClick={() => handleDevolver(p.id)}
                      sx={{
                        borderColor: PALETTE.blue,
                        color: PALETTE.blue,
                        "&:hover": {
                          borderColor: PALETTE.blueDark,
                          color: PALETTE.blueDark,
                        },
                      }}
                    >
                      Registrar Devolución
                    </Button>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Modal de éxito/error */}
        <Modal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          aria-labelledby="modal-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              bgcolor: PALETTE.paper,
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography id="modal-title" variant="h6" sx={{ color: PALETTE.blue }}>
              Aviso
            </Typography>
            <Typography sx={{ mt: 2, color: PALETTE.gray }}>{modalMessage}</Typography>
            <Button
              onClick={() => setModalVisible(false)}
              sx={{
                mt: 2,
                backgroundColor: PALETTE.blue,
                color: "#fff",
                "&:hover": {
                  backgroundColor: PALETTE.blueDark,
                },
              }}
            >
              Cerrar
            </Button>
          </Box>
        </Modal>
      </Container>
    </Box>
  )
}
