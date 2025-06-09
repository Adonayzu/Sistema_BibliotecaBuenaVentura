import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token"); // Obtén el token del almacenamiento

  if (!token) {
    // Si no hay token, redirige inmediatamente al login
    return <Navigate to="/" replace />;
  }

  // Si hay token, permite el acceso a la ruta protegida
  return children;
};

export default ProtectedRoute;