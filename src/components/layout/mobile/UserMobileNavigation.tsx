import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Compass,
  Package,
  User,
  LogOut
} from 'lucide-react';
import CartIcon from '../../../components/user/cart/CartIcon';
import CartSidebar from '../../../components/user/cart/CartSidebar';

const UserMobileNavigation: React.FC = () => {
  const { logout } = useAuth();

  const userNavItems = [
    { path: '/usuario/menu', label: 'Menú', icon: Compass },
    { path: '/usuario/pedidos', label: 'Pedidos', icon: Package },
    { path: '/usuario/favoritos', label: 'Favoritos', icon: User },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        {/* Main Navigation */}
        <div className="px-4 py-2">
          <div className="flex justify-around max-w-md mx-auto">
            {userNavItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-gray-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100"
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </Link>
            ))}
            
            {/* Cart Icon */}
            <div className="flex flex-col items-center py-2 px-3">
              <CartIcon />
              <span className="text-xs mt-1 font-medium">Carrito</span>
            </div>
          </div>
        </div>
        
        {/* Logout Section */}
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 px-3 rounded-lg transition-colors text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100"
          >
            <LogOut size={16} className="mr-2" />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </nav>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default UserMobileNavigation;