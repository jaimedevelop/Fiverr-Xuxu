import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
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
  LogOut
} from 'lucide-react';

const WebSidebar: React.FC = () => {
  const { logout } = useAuth();
  const { user: firestoreUser } = useUser();
  
  const userNavItems = [
    { path: '/user/menu', label: 'Menú', icon: Menu },
    { path: '/user/orders', label: 'Pedidos', icon: ShoppingBag },
    { path: '/user/profile', label: 'Perfil', icon: User },
  ];
  
  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Panel de Control', icon: BarChart3 },
    { path: '/admin/menu-management', label: 'Gestión de Menú', icon: Menu },
    { path: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
    { path: '/admin/analytics', label: 'Análisis', icon: TrendingUp },
    { path: '/admin/inventory', label: 'Inventario', icon: Package },
    { path: '/admin/business-profile', label: 'Perfil del Negocio', icon: Building2 },
    { path: '/admin/promotions', label: 'Promociones', icon: Megaphone },
    { path: '/admin/settings', label: 'Configuración', icon: Settings },
  ];
  
  const navItems = firestoreUser?.role === 'admin' ? adminNavItems : userNavItems;
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          {firestoreUser?.role === 'admin' ? 'Panel de Administración' : 'App de Restaurante'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">Bienvenido, {firestoreUser?.name || firestoreUser?.email}</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
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

export default WebSidebar;