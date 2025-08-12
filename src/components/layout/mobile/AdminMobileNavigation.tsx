import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { 
  Menu, 
  ShoppingBag, 
  User, 
  BarChart3, 
  Settings, 
  Package, 
  TrendingUp,
  Store,
  Building2,
  Megaphone,
  X,
  CreditCard,
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

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Panel de Control', icon: BarChart3 },
    { path: '/admin/menu-management', label: 'Gestión de Menú', icon: Menu },
    { path: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
    { path: '/admin/analytics', label: 'Análisis', icon: TrendingUp },
    { path: '/admin/inventory', label: 'Inventario', icon: Package },
    { path: '/admin/business-profile', label: 'Perfil del Negocio', icon: Building2 },
    { path: '/admin/commission-payments', label: 'Comisiones/Pagos', icon: CreditCard },
    { path: '/admin/promotions', label: 'Promociones', icon: Megaphone },
    { path: '/admin/settings', label: 'Configuración', icon: Settings },
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
        className="fixed top-4 left-4 z-60 bg-white rounded-lg shadow-lg p-3 border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
        aria-label="Abrir menú de administrador"
      >
        <Menu size={24} className="text-gray-700" />
      </button>
      
      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}
      
      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            {business?.logoUrl ? (
              <img 
                src={business.logoUrl} 
                alt={business.storeName} 
                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                {businessLoading ? (
                  <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Store size={24} className="text-white" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">Dulces Momentos Admin</h2>
              <p className="text-sm text-gray-600 truncate">
                {businessLoading ? 'Cargando...' : `Bienvenido, ${business?.storeName || 'Sin nombre'}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors duration-200"
            aria-label="Cerrar menú"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {adminNavItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={closeMenu}
                className="flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm group"
              >
                <div className="flex-shrink-0">
                  <Icon size={20} className="group-hover:text-blue-600 transition-colors duration-200" />
                </div>
                <span className="font-medium text-sm">{label}</span>
              </Link>
            ))}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full mt-4"
            >
              <div className="flex-shrink-0">
                <LogOut size={20} />
              </div>
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white shadow-sm">
            {business?.logoUrl ? (
              <img 
                src={business.logoUrl} 
                alt={business.storeName} 
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                {businessLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <User size={18} className="text-white" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {business?.storeName || 'Cargando...'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Panel de Administración
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMobileNavigation;