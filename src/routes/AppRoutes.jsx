import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import RecoverPassword from "../pages/auth/RecoverPassword";
import AdminDashboard from "../pages/admin/DashboardAdmin";
import ChefeDashboard from "../pages/chefe/DashboardChefe";
import CoordenadorDashboard from "../pages/coordenador/DashboardCoordenador";
import EstagiarioDashboard from "../pages/estagiario/DashboardEstagiario";
import SupervisorDashboard from "../pages/supervisor/DashboardSupervisor";
import TutorDashboard from "../pages/tutor/DashboardTutor";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/recover-password" element={<RecoverPassword />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<RecoverPassword />} />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/chefe/dashboard"
      element={
        <ProtectedRoute allowedRoles={["chefe_repartição"]}>
          <ChefeDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/coordenador/dashboard"
      element={
        <ProtectedRoute allowedRoles={["coordenador"]}>
          <CoordenadorDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/estagiario/dashboard"
      element={
        <ProtectedRoute allowedRoles={["estudante"]}>
          <EstagiarioDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/supervisor/dashboard"
      element={
        <ProtectedRoute allowedRoles={["supervisor"]}>
          <SupervisorDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/tutor/dashboard"
      element={
        <ProtectedRoute allowedRoles={["tutor"]}>
          <TutorDashboard />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);