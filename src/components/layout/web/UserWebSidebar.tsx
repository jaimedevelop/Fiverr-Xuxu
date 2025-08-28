import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import {
  Search,
  ShoppingBag,
  Heart,
  LogOut
} from 'lucide-react';
// Re-enabled cart functionality
import CartIcon from '../../../components/user/cart/CartIcon';
import Cart from '../../../components/user/cart/Cart';

const UserWebSidebar: React.FC = () => {
  const { logout } = useAuth();
  const { user: firestoreUser } = useUser();
  const [showCart, setShowCart] = useState(false);
  
  const userNavItems = [
    { path: '/usuario/explorar', label: 'Explorar', icon: Search },
    { path: '/usuario/pedidos', label: 'Pedidos', icon: ShoppingBag },
  ];
  
  return (
    <>
      <aside className="w-64 bg-white/95 backdrop-blur-sm border-r border-saffron-200 flex flex-col shadow-brand-lg">
        {/* Header Section */}
        <div className="p-6 border-b border-saffron-200 bg-gradient-saffron">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/20 rounded-xl flex items-center justify-center border border-white/40">
              <span className="text-2xl">🧁</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-orange-900">
                Dulces Momentos
              </h1>
              <p className="text-sm text-orange-800 mt-1">
                Hola, {firestoreUser?.name || firestoreUser?.email?.split('@')[0] || 'Cliente'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Section */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {userNavItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-saffron text-orange-900 shadow-saffron border-r-4 border-orange-600 transform scale-105'
                        : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-700 hover:scale-105'
                    }`
                  }
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{label}</span>
                </NavLink>
              </li>
            ))}
            
            {/* Re-enabled cart functionality - styled consistently with other nav items */}
            <li>
              <button 
                className="flex items-center px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 text-gray-700 hover:bg-saffron-50 hover:text-saffron-700 w-full text-left"
                onClick={() => setShowCart(true)}
              >
                <CartIcon />
                <span className="ml-3 font-medium">Carrito</span>
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Footer Section */}
        <div className="p-4 border-t border-saffron-200 bg-gradient-to-r from-saffron-50 to-orange-50">
          <button
            onClick={logout}
            className="btn-outline w-full flex items-center justify-center text-gray-700 hover:text-saffron-700"
          >
            <LogOut size={20} className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
      
      {/* Re-enabled cart component - same as FloatingCartButton */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </>
  );
};

export default UserWebSidebar;