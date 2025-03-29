import React from "react";
import { Routes, Route } from 'react-router-dom';


import Login from '../pages/Login';

import PrivateRoutes from "../components/auth/PrivateRoutes/PrivateRoutes";
import Dashboard from "../pages/Dashboard";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
                <PrivateRoutes>
                    <Dashboard />
                </PrivateRoutes>
            }/>
            <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
    );
}