// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { BusinessProvider } from './contexts/BusinessContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { CartProvider } from './contexts/CartContext';
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
import UserExplore from './pages/user/UserExplore'; // NEW: Import UserExplore
import UserMenu from './pages/user/UserMenu'; // UPDATED: Now business-specific
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';
import Favorites from './pages/user/Favorites';
import OrderHistory from './pages/user/OrderHistory';
// Admin pages
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import AdminOrders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import Inventory from './pages/admin/Inventory';
import BusinessProfile from './pages/admin/BusinessProfile';
import Promotions from './pages/admin/Promotions';
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
    
 // Default route based on user role - USE FIRESTORE USER ROLE
  const getDefaultRoute = () => {
    console.log("🎯 Getting default route for role:", firestoreUser?.role);
    if (firestoreUser?.role === 'admin') {
      console.log("  → Directing to admin dashboard");
      return '/admin/dashboard';
    }
    console.log("  → Directing to user explore"); // UPDATED: Changed from menu to explore
    return '/usuario/explorar'; // UPDATED: Changed from /usuario/menu to /usuario/explorar
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
            {/* NEW: Explore page (marketplace view) */}
            <Route path="explorar" element={
              <ProtectedRoute requiredRole="user">
                <UserExplore />
              </ProtectedRoute>
            } />
            {/* UPDATED: Menu is now business-specific with businessId parameter */}
            <Route path="menu/:businessId" element={
              <ProtectedRoute requiredRole="user">
                <UserMenu />
              </ProtectedRoute>
            } />
            {/* REDIRECT: Old menu route to new explore route */}
            <Route path="menu" element={<Navigate to="/usuario/explorar" replace />} />
            <Route path="pedidos" element={
              <ProtectedRoute requiredRole="user">
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="favoritos" element={
              <ProtectedRoute requiredRole="user">
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="perfil" element={
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
            <Route path="pedidos" element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="analitica" element={
              <ProtectedRoute requiredRole="admin">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="inventario" element={
              <ProtectedRoute requiredRole="admin">
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="perfil-negocio" element={
              <ProtectedRoute requiredRole="admin">
                <BusinessProfile />
              </ProtectedRoute>
            } />
            <Route path="promociones" element={
              <ProtectedRoute requiredRole="admin">
                <Promotions />
              </ProtectedRoute>
            } />
            <Route path="configuracion" element={
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
  
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <BusinessProvider>
            <OrderProvider>
            <InventoryProvider>
              <AnalyticsProvider>
                  <FavoritesProvider>
                    <CartProvider>
                      <AppRoutes />
                    </CartProvider>
                  </FavoritesProvider>
              </AnalyticsProvider>
            </InventoryProvider>
          </OrderProvider>
          </BusinessProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;