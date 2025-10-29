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
    <Router basename= "/manager">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Layout component={<Dashboard />} />} />
          <Route path="/componentes" element={<Layout component={<Componentes />} />} />
          <Route path="/pedidos" element={<Layout component={<Pedidos />} />} />
          <Route path="/usuarios" element={<Layout component={<Usuarios />} />} />
        </Route>
      </Routes>
    </Router>
  );
};