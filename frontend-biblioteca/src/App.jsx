import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Layout from "./Layout/Layout";
import ProtectedRoute from "./Routes/ProtectedRoute";
import "./App.css";
import CerrarSesion from "./components/CerrarSesion/CerrarSesion";


function App() {

  return (
    <Router>
      {/* El atributo inert se aplica al contenedor principal */}
      <div id="app-container" >
        <Routes>
          <Route path="/" element={<Login />} />
           <Route path="/salir" element={<CerrarSesion />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;