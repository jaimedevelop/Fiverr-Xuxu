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
      <div className="flex flex-col h-screen bg-gray-50">
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className={`flex-1 overflow-y-auto ${firestoreUser?.role === 'admin' ? 'pb-0' : 'pb-16'}`}>
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