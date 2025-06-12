import React from "react";
import { Box, Typography } from "@mui/material";

const Inicio = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 3,
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        ¡Bienvenido a la Biblioteca Buena Ventura!
      </Typography>
    </Box>
  );
};

export default Inicio;