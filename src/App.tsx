// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { CartProvider } from './contexts/CartContext'; //Component is named CartContext NOT CartProvider, unlike the rest
import { UserProvider } from './contexts/UserContext';
import ResponsiveLayout from './components/layout/ResponsiveLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';
import AdminAuth from './pages/auth/AdminAuth';
import UserAuth from './pages/auth/UserAuth';
import UserRegistration from './components/user/registration/UserRegistration';
import BusinessRegistration from './pages/business/BusinessRegistration';
import EmailVerification from './pages/business/EmailVerification';
import { useUser } from './contexts/UserContext';
// User pages
import UserExplore from './pages/user/UserExplore';
import UserMenu from './pages/user/UserMenu';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';
import OrderHistory from './pages/user/OrderHistory';
// Admin pages - REMOVED: Dashboard import
import MenuManagement from './pages/admin/MenuManagement';
import AdminOrders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import BusinessProfile from './pages/admin/BusinessProfile';
import Settings from './pages/admin/Settings';

// Define AppRoutes inside the App component to have access to AuthProvider
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
  
  // Define AppRoutes inside App so it has access to the AuthProvider context
  const AppRoutes = () => {
  const { user: firestoreUser, loading: userLoading } = useUser();
  
  console.log("🔍 APP ROUTING DEBUG:");
  console.log("  - User loading:", userLoading);
  console.log("  - Firestore user:", firestoreUser);
  console.log("  - Firestore user role:", firestoreUser?.role);
    
  // Show loading spinner while checking authentication status
  if (userLoading || userLoading) {
    console.log("⏳ Showing loading spinner - authLoading:", userLoading, "userLoading:", userLoading);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
    
    // If user is not authenticated, show auth routes
    if (!firestoreUser) {
      console.log("❌ User not authenticated, showing auth routes");
      return (
        <Routes>
          <Route path="/iniciar-sesion" element={<AuthPage />} />
          <Route path="/acceso-admin" element={<AdminAuth />} />
          <Route path="/acceso-usuario" element={<UserAuth />} />
          <Route path="/registro-usuario" element={
            <>
              {console.log("Rendering UserRegistration component")}
              <UserRegistration />
            </>
          } />
          <Route path="/registro-negocio" element={<BusinessRegistration />} />
          <Route path="/verificar-correo/:businessId" element={<EmailVerification />} />
          <Route path="*" element={<Navigate to="/iniciar-sesion" replace />} />
        </Routes>
      );
    }
    
 // Default route based on user role - UPDATED: Admin goes to orders instead of dashboard
  const getDefaultRoute = () => {
    console.log("🎯 Getting default route for role:", firestoreUser?.role);
    if (firestoreUser?.role === 'admin') {
      console.log("  → Directing to admin orders"); // UPDATED: Changed from dashboard to orders
      return '/admin/pedidos'; // UPDATED: Changed from '/admin/dashboard' to '/admin/pedidos'
    }
    console.log("  → Directing to user explore");
    return '/usuario/explorar';
  };
    
    // If user is authenticated, show protected routes
    return (
      <Routes>
        {/* Redirect auth routes to default route when already authenticated */}
        <Route path="/iniciar-sesion" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/acceso-admin" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/acceso-usuario" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/registro-negocio" element={<Navigate to={getDefaultRoute()} replace />} />
        
        <Route path="/" element={<ResponsiveLayout />}>
          {/* User routes */}
          <Route path="usuario">
            <Route path="explorar" element={
              <ProtectedRoute requiredRole="user">
                <UserExplore />
              </ProtectedRoute>
            } />
            <Route path="menu/:businessId" element={
              <ProtectedRoute requiredRole="user">
                <UserMenu />
              </ProtectedRoute>
            } />
            <Route path="menu" element={<Navigate to="/usuario/explorar" replace />} />
            <Route path="pedidos" element={
              <ProtectedRoute requiredRole="user">
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="perfil" element={
              <ProtectedRoute requiredRole="user">
                <Profile />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Admin routes - REMOVED: Dashboard route completely */}
          <Route path="admin">
            {/* UPDATED: Orders is now the main admin page */}
            <Route path="pedidos" element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="menu-management" element={
              <ProtectedRoute requiredRole="admin">
                <MenuManagement />
              </ProtectedRoute>
            } />
            <Route path="analitica" element={
              <ProtectedRoute requiredRole="admin">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="perfil-negocio" element={
              <ProtectedRoute requiredRole="admin">
                <BusinessProfile />
              </ProtectedRoute>
            } />
            <Route path="configuracion" element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            } />
            {/* ADDED: Redirect /admin to orders page */}
            <Route path="" element={<Navigate to="/admin/pedidos" replace />} />
          </Route>
          
          {/* Default redirects based on role */}
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        </Route>
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    );
  };
  
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <BusinessProvider>
            <OrderProvider>
              <AnalyticsProvider>
                <CartProvider>
                  <AppRoutes />
                </CartProvider>
              </AnalyticsProvider>
            </OrderProvider>
          </BusinessProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;