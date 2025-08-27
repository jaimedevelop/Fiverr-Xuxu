import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import UserMobileNavigation from './UserMobileNavigation';
import AdminMobileNavigation from './AdminMobileNavigation';

const MobileLayout: React.FC = () => {
  const { user: firestoreUser, loading } = useUser();
  
  console.log("📱 MOBILE LAYOUT DEBUG:");
  console.log("  - Firestore user:", firestoreUser);
  console.log("  - User role:", firestoreUser?.role);
  console.log("  - Loading:", loading);
  
  // Show loading spinner while checking user context
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-main">
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-saffron-200 border-t-saffron-600"></div>
            <p className="text-saffron-600 font-medium">Cargando Dulces Momentos...</p>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gradient-main">
      <main className={`flex-1 overflow-y-auto ${firestoreUser?.role === 'admin' ? 'pb-0' : 'pb-20'}`}>
        <Outlet />
      </main>
      
      {/* Render navigation based on user role from UserContext (Firestore) */}
      {firestoreUser?.role === 'admin' ? (
        <AdminMobileNavigation />
      ) : (
        <UserMobileNavigation />
      )}
    </div>
  );
};

export default MobileLayout;