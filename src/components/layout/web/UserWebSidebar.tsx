import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Menu, 
  ShoppingBag, 
  User, 
  LogOut
} from 'lucide-react';

const UserWebSidebar: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  
  const userNavItems = [
    { path: '/usuario/menu', label: 'Menú', icon: Menu },
    { path: '/usuario/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { path: '/usuario/perfil', label: 'Perfil', icon: User },
  ];
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Xuxu - Postres
        </h1>
        <p className="text-sm text-gray-600 mt-1">Bienvenido, {user?.email}</p>
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
  );
};

export default UserWebSidebar;