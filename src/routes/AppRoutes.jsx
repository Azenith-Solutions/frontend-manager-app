import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import PrivateRoutes from "../components/auth/PrivateRoutes/PrivateRoutes";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Componentes from "../pages/Componentes/Componentes";
import Pedidos from "../pages/Pedidos/Pedidos";
import { Usuarios } from "../pages/Usuarios/Usuarios";

export default function AppRoutes() {
  return (
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
        <Route path="usuarios" element={<Usuarios/>} />
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
}