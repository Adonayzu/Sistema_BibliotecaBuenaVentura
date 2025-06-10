import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Inicio from "../Pages/Inicio/Inicio";
import Usuarios from "../Pages/Usuarios/Usuarios";
import Roles from "../Pages/Roles/Roles";
import Clientes from "../Pages/Clientes/Clientes";
import Libros from "../Pages/Libros/Libros";
import Prestamos from "../Pages/Prestamos/Prestamos";
import Reportes from "../Pages/Reportes/Reportes";





import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública para el login */}
      <Route path="/" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/inicio"
        element={
          <ProtectedRoute>
            <Inicio/>
          </ProtectedRoute>
        }
      />

       <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios/>
          </ProtectedRoute>
        }
      />


       <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <Roles/>
          </ProtectedRoute>
        }
      />


      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <Clientes/>
          </ProtectedRoute>
        }
      />


       <Route
        path="/libros"
        element={
          <ProtectedRoute>
            <Libros/>
          </ProtectedRoute>
        }
      />


       <Route
        path="/prestamos"
        element={
          <ProtectedRoute>
            <Prestamos/>
          </ProtectedRoute>
        }
      />



       <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <Reportes/>
          </ProtectedRoute>
        }
      />

      
      
      

      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
