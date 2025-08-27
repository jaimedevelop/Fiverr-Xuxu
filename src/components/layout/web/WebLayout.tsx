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
    <div className="flex h-screen bg-gradient-main">
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
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white/30 backdrop-blur-sm">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WebLayout;