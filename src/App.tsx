import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

// User pages
import Menu from './pages/user/Menu';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import AdminOrders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import Inventory from './pages/admin/Inventory';
import BusinessProfile from './pages/admin/BusinessProfile';
import Promotions from './pages/admin/Promotions';
import Settings from './pages/admin/Settings';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Default route based on user role
  const getDefaultRoute = () => {
    if (user?.role === 'admin') {
      return '/admin/dashboard';
    }
    return '/user/menu';
  };

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/" element={<ResponsiveLayout />}>
        {/* User routes */}
        <Route path="user">
          <Route path="menu" element={
            <ProtectedRoute requiredRole="user">
              <Menu />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute requiredRole="user">
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute requiredRole="user">
              <Profile />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Admin routes */}
        <Route path="admin">
          <Route path="dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="menu-management" element={
            <ProtectedRoute requiredRole="admin">
              <MenuManagement />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute requiredRole="admin">
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="inventory" element={
            <ProtectedRoute requiredRole="admin">
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="business-profile" element={
            <ProtectedRoute requiredRole="admin">
              <BusinessProfile />
            </ProtectedRoute>
          } />
          <Route path="promotions" element={
            <ProtectedRoute requiredRole="admin">
              <Promotions />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute requiredRole="admin">
              <Settings />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Default redirects based on role */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      </Route>
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
};

function App() {
  // Register service worker
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
