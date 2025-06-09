import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";

const PALETTE = {
  background: "#f5f6fa",
  paper: "#fff",
  blue: "#3b82f6",
  blueDark: "#2563eb",
  gray: "#6b7280",
};

const Reportes = () => (
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
        maxWidth: 700,
        px: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: PALETTE.paper,
          boxShadow: "0 2px 16px 0 rgba(60,72,88,0.07)",
          width: "100%",
          mt: 4,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ color: PALETTE.gray, mb: 2 }}
        >
          Reportería (Solo Administrador)
        </Typography>
        <Stack spacing={2}>
          <Button
            variant="outlined"
            sx={{
              borderColor: PALETTE.blue,
              color: PALETTE.blue,
              "&:hover": {
                borderColor: PALETTE.blueDark,
                color: PALETTE.blueDark,
              },
            }}
            fullWidth
          >
            Historial por libro
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: PALETTE.blue,
              color: PALETTE.blue,
              "&:hover": {
                borderColor: PALETTE.blueDark,
                color: PALETTE.blueDark,
              },
            }}
            fullWidth
          >
            Préstamos por cliente
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: PALETTE.blue,
              color: PALETTE.blue,
              "&:hover": {
                borderColor: PALETTE.blueDark,
                color: PALETTE.blueDark,
              },
            }}
            fullWidth
          >
            Reportes generales y estadísticas
          </Button>
        </Stack>
      </Paper>
    </Container>
  </Box>
);

export default Reportes;