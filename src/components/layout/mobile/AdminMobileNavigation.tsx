import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { 
  Menu, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  TrendingUp,
  Building2,
  X,
  LogOut
} from 'lucide-react';

const AdminMobileNavigation: React.FC = () => {
  const { logout } = useAuth();
  const { business, loading: businessLoading } = useBusiness();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // UPDATED: Navigation items with new order and dashboard removed
  const adminNavItems = [
    { path: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag }, // MOVED: First position
    { path: '/admin/menu-management', label: 'Gestión de Menú', icon: Menu }, // SECOND
    { path: '/admin/analitica', label: 'Análisis', icon: TrendingUp }, // THIRD
    { path: '/admin/perfil-negocio', label: 'Perfil del Negocio', icon: Building2 }, // FOURTH
    { path: '/admin/configuracion', label: 'Ajustes', icon: Settings }, // FIFTH (renamed from Configuración)
    // REMOVED: Dashboard item completely
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!menuRef.current) return;
    setStartY(e.touches[0].clientY);
    setScrollTop(menuRef.current.scrollTop);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !menuRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const diffY = startY - currentY;
    const newScrollTop = scrollTop + diffY;
    
    menuRef.current.scrollTop = Math.max(0, newScrollTop);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-40 bg-gradient-purple text-white rounded-xl shadow-purple p-3 border border-purple-300 hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Abrir menú de administrador"
      >
        <Menu size={24} />
      </button>
      
      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={closeMenu}
        />
      )}
      
      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-brand-xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200 bg-gradient-purple">
          <div className="flex items-center space-x-3">
            {business?.logoUrl ? (
              <img 
                src={business.logoUrl} 
                alt={business.storeName} 
                className="w-12 h-12 rounded-xl object-cover border-2 border-white/30 shadow-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                {businessLoading ? (
                  <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Building2 size={24} className="text-white" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white">Panel Administrativo</h2>
              <p className="text-sm text-purple-100 truncate">
                {businessLoading ? 'Cargando...' : `${business?.storeName || 'Dulces Momentos'}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            aria-label="Cerrar menú"
          >
            <X size={22} className="text-white" />
          </button>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {adminNavItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={closeMenu}
                className="flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 text-gray-700 hover:bg-gradient-purple hover:text-white hover:shadow-purple hover:scale-105 group"
              >
                <div className="flex-shrink-0">
                  <Icon size={20} className="group-hover:text-white transition-colors duration-200" />
                </div>
                <span className="font-medium text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-purple-100">
          <button
            onClick={handleLogout}
            className="btn-admin w-full flex items-center justify-center"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm">
            {business?.logoUrl ? (
              <img 
                src={business.logoUrl} 
                alt={business.storeName} 
                className="w-10 h-10 rounded-full object-cover border border-purple-200"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center">
                {businessLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Building2 size={18} className="text-white" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {business?.storeName || 'Dulces Momentos'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Administrador
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMobileNavigation;