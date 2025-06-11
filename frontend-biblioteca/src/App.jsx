import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Layout from "./Layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";


function App() {

  return (
    <Router>
      {/* El atributo inert se aplica al contenedor principal */}
      <div id="app-container" >
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/salir" element={<CerrarSession />} /> */}
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