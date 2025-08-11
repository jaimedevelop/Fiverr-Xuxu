import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { authState } = useAuth();
  const { user: firestoreUser, loading: userLoading } = useUser();

  console.log("🛡️ PROTECTED ROUTE CHECK:");
  console.log("  - Required role:", requiredRole);
  console.log("  - Auth loading:", authState.loading);
  console.log("  - User loading:", userLoading);
  console.log("  - Auth user:", authState.user);
  console.log("  - Firestore user:", firestoreUser);
  console.log("  - Firestore user role:", firestoreUser?.role);

  // Show loading while auth or user data is loading
  if (authState.loading || userLoading) {
    console.log("  - Showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If no authenticated user, redirect to login
  if (!authState.user) {
    console.log("  - No auth user, redirecting to login");
    return <Navigate to="/iniciar-sesion" replace />;
  }

  // If no firestore user data loaded yet, show loading
  if (!firestoreUser) {
    console.log("  - No firestore user data, showing loading");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check role requirements using FIRESTORE user role
  if (requiredRole && firestoreUser.role !== requiredRole) {
    console.log(`  - Access denied: required ${requiredRole}, user has ${firestoreUser.role}`);
    return <Navigate to="/no-autorizado" replace />;
  }

  console.log("  - Access granted!");
  return <>{children}</>;
};

export default ProtectedRoute;