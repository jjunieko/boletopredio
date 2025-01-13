import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import Layout from '../components/Layout';

// Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Bills from '../pages/Bills';
import Residents from '../pages/Residents';
import BillView from '../pages/Residents/BillView';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  const { user } = useAuth();

  // Redireciona usuário logado para dashboard se tentar acessar login/register
  if (user && ['/login', '/register'].includes(window.location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route 
        path="/" 
        element={user ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="bills" element={<Bills />} />
        <Route path="residents">
          <Route index element={<Residents />} />
          <Route path=":billId" element={<BillView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 