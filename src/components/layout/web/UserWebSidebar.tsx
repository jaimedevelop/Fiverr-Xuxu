import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import {
  Search,
  ShoppingBag,
  User,
  LogOut
} from 'lucide-react';
// Temporarily disabled cart functionality
// import CartIcon from '../../../components/user/cart/CartIcon';
// import CartSidebar from '../../../components/user/cart/CartSidebar';

const UserWebSidebar: React.FC = () => {
  const { logout } = useAuth();
  const { user: firestoreUser } = useUser();
  
  const userNavItems = [
    { path: '/usuario/explorar', label: 'Explorar', icon: Search },
    { path: '/usuario/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { path: '/usuario/favoritos', label: 'Favoritos', icon: User },
  ];
  
  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            Dulces Momentos
          </h1>
          <p className="text-sm text-gray-600 mt-1">Bienvenido, {firestoreUser?.email}</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {userNavItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon size={20} className="mr-3" />
                  {label}
                </NavLink>
              </li>
            ))}
            
            {/* Temporarily disabled cart functionality */}
            {/* 
            <li>
              <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <CartIcon />
                <span className="ml-3">Carrito</span>
              </div>
            </li>
            */}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
      
      {/* Temporarily disabled cart sidebar */}
      {/* <CartSidebar /> */}
    </>
  );
};

export default UserWebSidebar;