import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recover" element={<RecoverPassword />} />

        {user?.role === 'ADMIN' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </>
        )}

        {user?.role === 'CHEFE_REPARTICAO' && (
          <>
            <Route path="/chefe/dashboard" element={<ChefeDashboard />} />
            <Route path="/chefe/instituicoes" element={<Instituicoes />} />
            <Route path="/chefe/estagios" element={<Estagios />} />
          </>
        )}

        {/* Continue para coordenador, estagiário, supervisor e tutor */}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};