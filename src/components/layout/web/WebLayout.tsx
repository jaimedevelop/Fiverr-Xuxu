import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import AdminWebSidebar from './AdminWebSidebar';
import UserWebSidebar from './UserWebSidebar';

const WebLayout: React.FC = () => {
  const { user: firestoreUser } = useUser();

  console.log("🖥️ WEB LAYOUT: Determining sidebar");
  console.log("  - Firestore user role:", firestoreUser?.role);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Render sidebar based on FIRESTORE user role */}
      {firestoreUser?.role === 'admin' ? (
        <>
          {console.log("  - Rendering AdminWebSidebar")}
          <AdminWebSidebar />
        </>
      ) : (
        <>
          {console.log("  - Rendering UserWebSidebar")}
          <UserWebSidebar />
        </>
      )}
      
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default WebLayout;