import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Layout from "./Layout/Layout";
import ProtectedRoute from "./Routes/ProtectedRoute";
import "./App.css";


function App() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Router>
      {/* El atributo inert se aplica al contenedor principal */}
      <div id="app-container" inert={openModal ? true : undefined}>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/salir" element={<CerrarSession />} /> */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout setOpenModal={setOpenModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;