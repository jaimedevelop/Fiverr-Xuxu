import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import UserMobileNavigation from './UserMobileNavigation';
import AdminMobileNavigation from './AdminMobileNavigation';

const MobileLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className={`flex-1 overflow-y-auto ${user?.role === 'admin' ? 'pb-0' : 'pb-16'}`}>
        <Outlet />
      </main>
      
      {/* Render navigation based on user role */}
      {user?.role === 'admin' ? (
        <AdminMobileNavigation />
      ) : (
        <UserMobileNavigation />
      )}
    </div>
  );
};

export default MobileLayout;