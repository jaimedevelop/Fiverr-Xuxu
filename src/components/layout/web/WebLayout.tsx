import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AdminWebSidebar from './AdminWebSidebar';
import UserWebSidebar from './UserWebSidebar';

const WebLayout: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Render sidebar based on user role */}
      {user?.role === 'admin' ? (
        <AdminWebSidebar />
      ) : (
        <UserWebSidebar />
      )}
      
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default WebLayout;