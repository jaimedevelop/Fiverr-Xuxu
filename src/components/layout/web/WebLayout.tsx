import React from 'react';
import { Outlet } from 'react-router-dom';
import WebSidebar from './WebSidebar';

const WebLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <WebSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default WebLayout;