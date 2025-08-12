import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Package,
  Settings
} from 'lucide-react';
import CartIcon from '../../../components/user/cart/CartIcon';
import CartSidebar from '../../../components/user/cart/CartSidebar';

const UserMobileNavigation: React.FC = () => {
  const userNavItems = [
    { path: '/usuario/explorar', label: 'Explorar', icon: Search },
    { path: '/usuario/pedidos', label: 'Pedidos', icon: Package },
    { path: '/usuario/perfil', label: 'Ajustes', icon: Settings },
  ];

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
      </nav>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default UserMobileNavigation;