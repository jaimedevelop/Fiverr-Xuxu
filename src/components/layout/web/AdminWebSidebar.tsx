import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import { 
  Menu, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Package, 
  TrendingUp,
  Building2,
  Megaphone,
  LogOut
} from 'lucide-react';

const AdminWebSidebar: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user: firestoreUser } = useUser();
  
  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Panel de Control', icon: BarChart3 },
    { path: '/admin/menu-management', label: 'Gestión de Menú', icon: Menu },
    { path: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { path: '/admin/analitica', label: 'Análisis', icon: TrendingUp },
    { path: '/admin/inventario', label: 'Inventario', icon: Package },
    { path: '/admin/perfil-negocio', label: 'Perfil del Negocio', icon: Building2 },
    { path: '/admin/promociones', label: 'Promociones', icon: Megaphone },
    { path: '/admin/configuracion', label: 'Configuración', icon: Settings },
  ];
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-sm text-gray-600 mt-1">Bienvenido, {firestoreUser?.email}</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {adminNavItems.map(({ path, label, icon: Icon }) => (
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

export default AdminWebSidebar;