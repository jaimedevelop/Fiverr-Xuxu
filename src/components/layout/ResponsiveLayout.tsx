import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import MobileLayout from './mobile/MobileLayout';
import WebLayout from './web/WebLayout';

const ResponsiveLayout: React.FC = () => {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileLayout /> : <WebLayout />;
};

export default ResponsiveLayout;