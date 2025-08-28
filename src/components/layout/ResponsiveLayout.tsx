import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import MobileLayout from './mobile/MobileLayout';
import WebLayout from './web/WebLayout';
import FloatingCartButton from '../user/cart/FloatingCartButton';

const ResponsiveLayout: React.FC = () => {
  const { user } = useUser();
  
  return (
    <div className="min-h-screen bg-gradient-main">
      {/* Mobile Layout (screens < 768px) */}
      <div className="md:hidden">
        <MobileLayout>
          <Outlet />
        </MobileLayout>
      </div>
      
      {/* Web Layout (screens >= 768px) */}
      <div className="hidden md:block">
        <WebLayout>
          <Outlet />
        </WebLayout>
      </div>

      {/* Floating Cart Button - Show for regular users on ALL devices (mobile AND desktop) */}
      {user?.role === 'user' && (
        <div>
          <FloatingCartButton />
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;