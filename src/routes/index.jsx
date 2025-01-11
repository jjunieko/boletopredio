import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import Layout from '../components/Layout';

// Pages
import Bills from '../pages/Bills';
import Residents from '../pages/Residents';
import BillView from '../pages/Residents/BillView';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  const { user, ROLES } = useAuth();

  const PrivateRoute = ({ children, roles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
      return <Navigate to="/residents" replace />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route 
          path="bills" 
          element={
            <PrivateRoute roles={[ROLES.SUPER_ADMIN, ROLES.MANAGER]}>
              <Bills />
            </PrivateRoute>
          } 
        />
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