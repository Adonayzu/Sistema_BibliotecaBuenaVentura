import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import AppRoutes from "../routes/Routes";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex"}}>
      {/* Sidebar siempre visible */}
      <Sidebar />
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Permite que el contenido principal ocupe el espacio restante
          p: 2, // Espaciado interno
          paddingTop: "85px", // Espaciado superior
         // backgroundColor: "#fafafa", // Color de fondo del contenido principal
          minHeight: "100vh", // Asegura que ocupe toda la altura de la ventana
        }}
      >
        <AppRoutes /> {/* Aquí se renderizan las rutas protegidas y todo el contenido de todas las paginas */}
        
        {children}
      </Box>
    </Box>
  );
};

export default Layout;