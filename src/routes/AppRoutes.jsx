import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "../components/auth/PrivateRoutes/PrivateRoutes";
import Login from "../pages/Login/Login";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Componentes from "../pages/Componentes/Componentes";
import Pedidos from "../pages/Pedidos/Pedidos";
import Usuarios from "../pages/Usuarios/Usuarios";

const AppRoutes = () => {
  return (
    // Funciona sem o /mangaer, por que?
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={
          <PrivateRoutes>
            <Layout />
          </PrivateRoutes>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="componentes" element={<Componentes />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;