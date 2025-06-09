import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Modal,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  Pagination,
} from "@mui/material";

const PALETTE = {
  background: "#f5f6fa",
  paper: "#fff",
  blue: "#3b82f6",
  blueDark: "#2563eb",
  gray: "#6b7280",
};

const ITEMS_PER_PAGE = 5; // Cambia este valor para mostrar más/menos libros por página

const AgregarLibro = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [libros, setLibros] = useState([]);
  const [page, setPage] = useState(1);

  const validate = (values) => {
    const errors = {};
    if (!values.titulo) errors.titulo = "El título es obligatorio";
    if (!values.autor) errors.autor = "El autor es obligatorio";
    if (!values.isbn) errors.isbn = "El ISBN es obligatorio";
    if (!values.cantidad) errors.cantidad = "La cantidad es obligatoria";
    else if (isNaN(values.cantidad) || Number(values.cantidad) < 0)
      errors.cantidad = "La cantidad no puede ser negativa";
    if (values.anio) {
      const anioNum = Number(values.anio);
      const currentYear = new Date().getFullYear();
      if (anioNum < 1000 || anioNum > currentYear)
        errors.anio = "Año inválido";
    }
    return errors;
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setLibros((prev) => [...prev, values]);
    setModalMessage("¡Libro agregado correctamente!");
    setModalVisible(true);
    setSubmitting(false);
    resetForm();
    setPage(1); // Vuelve a la primera página al agregar un libro
  };

  // Paginación
  const totalPages = Math.ceil(libros.length / ITEMS_PER_PAGE);
  const librosPaginados = libros.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleChangePage = (event, value) => {
    setPage(value);
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
            Agregar Nuevo Libro
          </Typography>
          <Formik
            initialValues={{
              titulo: "",
              autor: "",
              editorial: "",
              anio: "",
              isbn: "",
              cantidad: "",
            }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form>
                {[
                  { label: "Título", name: "titulo" },
                  { label: "Autor", name: "autor" },
                  { label: "Editorial", name: "editorial" },
                  {
                    label: "Año de publicación",
                    name: "anio",
                    type: "number",
                  },
                  { label: "ISBN", name: "isbn" },
                  {
                    label: "Cantidad disponible",
                    name: "cantidad",
                    type: "number",
                  },
                ].map((field) => (
                  <Box sx={{ mb: 2 }} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type || "text"}
                      value={values[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[field.name] && Boolean(errors[field.name])}
                      helperText={touched[field.name] && errors[field.name]}
                      variant="outlined"
                      sx={{
                        "& .MuiInputLabel-root": { color: PALETTE.gray },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: PALETTE.blue,
                        },
                        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                          borderColor: PALETTE.blue,
                        },
                      }}
                    />
                  </Box>
                ))}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: PALETTE.blue,
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: PALETTE.blueDark,
                    },
                  }}
                >
                  {isSubmitting ? "Guardando..." : "GUARDAR LIBRO"}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>

        {/* Lista de libros con paginación */}
        {libros.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, width: "100%" }}>
            <Typography variant="h5" sx={{ color: PALETTE.blue, mb: 2 }}>
              Libros Registrados
            </Typography>
            <List>
              {librosPaginados.map((libro, index) => (
                <React.Fragment key={index + (page - 1) * ITEMS_PER_PAGE}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${libro.titulo} (${libro.anio || "sin año"})`}
                      secondary={
                        <>
                          <strong>Autor:</strong> {libro.autor} |{" "}
                          <strong>Editorial:</strong> {libro.editorial || "N/A"} |{" "}
                          <strong>ISBN:</strong> {libro.isbn} |{" "}
                          <strong>Cantidad:</strong> {libro.cantidad}
                        </>
                      }
                    />
                  </ListItem>
                  {index < librosPaginados.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            {/* Paginación */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Stack>
          </Paper>
        )}

        {/* Modal de éxito */}
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
              Registro de Libro
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
  );
};

export default AgregarLibro;
