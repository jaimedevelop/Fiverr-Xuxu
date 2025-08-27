import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUser } from '../../../contexts/UserContext';
import { useBusiness } from '../../../contexts/BusinessContext';
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
  const { business, loading: businessLoading } = useBusiness();
  
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
    <aside className="w-64 bg-white/95 backdrop-blur-sm border-r border-purple-100 flex flex-col shadow-brand-lg">
      {/* Header Section */}
      <div className="p-6 border-b border-purple-100 bg-gradient-purple">
        <div className="flex items-center space-x-3 mb-3">
          {business?.logoUrl ? (
            <img 
              src={business.logoUrl} 
              alt={business.storeName} 
              className="w-12 h-12 rounded-xl object-cover border-2 border-white/30 shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center border border-white/30">
              {businessLoading ? (
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">
              Panel Administrativo
            </h1>
            <p className="text-sm text-purple-100 mt-1 truncate">
              {businessLoading ? 'Cargando...' : `${business?.storeName || 'Dulces Momentos'}`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {adminNavItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-purple text-white shadow-purple border-r-4 border-white transform scale-105'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:scale-105'
                  }`
                }
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer Section */}
      <div className="p-4 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <button
          onClick={logout}
          className="btn-admin w-full flex items-center justify-center"
        >
          <LogOut size={20} className="mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminWebSidebar;