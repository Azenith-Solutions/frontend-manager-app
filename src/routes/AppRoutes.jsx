import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import PrivateRoutes from "../components/auth/PrivateRoutes/PrivateRoutes";
import Layout from "../components/Layout/Layout";
import Gerenciamento from "../pages/Gerenciamento/Gerenciamento";
import Pedidos from "../pages/Pedidos/Pedidos";
import Analise from "../pages/Analise/Analise";
import Suporte from "../pages/Suporte/Suporte";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/" element={
          <PrivateRoutes>
            <Layout />
          </PrivateRoutes>
        }>
        <Route path="gerenciamento" element={<Gerenciamento />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="analise" element={<Analise />} />
        <Route path="suporte" element={<Suporte />} />
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
}