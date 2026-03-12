import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import RecoverPassword from "../pages/auth/RecoverPassword";
import AdminDashboard from "../pages/admin/DashboardAdmin";
import CoordenadorDashboard from "../pages/coordenador/Dashboard";
import EstagiarioDashboard from "../pages/estagiario/MeuEstagio";
import ProtectedRoute from "./ProtectedRoute";

export const AppRoutes = () => (
  <Routes>
    
    <Route path="/login" element={<Login />} />
    <Route path="/recover" element={<RecoverPassword />} />
    <Route path="/admin/dashboard" element={
      <ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>
    }/>
    <Route path="/dashboards/coordenador" element={
      <ProtectedRoute allowedRoles={["COORDENADOR"]}><CoordenadorDashboard /></ProtectedRoute>
    }/>
    <Route path="/dashboards/estagiario" element={
      <ProtectedRoute allowedRoles={["ESTAGIARIO"]}><EstagiarioDashboard /></ProtectedRoute>
    }/>
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);