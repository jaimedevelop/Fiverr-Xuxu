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
  Building2,
  Megaphone,
  LogOut,
  Heart,
  Search
} from 'lucide-react';

const WebSidebar: React.FC = () => {
  const { logout } = useAuth();
  const { user: firestoreUser } = useUser();
  
  const userNavItems = [
    { path: '/usuario/explorar', label: 'Explorar', icon: Search },
    { path: '/usuario/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { path: '/usuario/favoritos', label: 'Favoritos', icon: Heart },
    { path: '/usuario/perfil', label: 'Perfil', icon: User },
  ];
  
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
  
  const navItems = firestoreUser?.role === 'admin' ? adminNavItems : userNavItems;
  const isAdmin = firestoreUser?.role === 'admin';
  
  return (
    <aside className={`w-64 bg-white/95 backdrop-blur-sm flex flex-col shadow-brand-lg ${
      isAdmin ? 'border-r border-purple-100' : 'border-r border-saffron-200'
    }`}>
      {/* Header Section */}
      <div className={`p-6 border-b ${
        isAdmin 
          ? 'border-purple-100 bg-gradient-purple' 
          : 'border-saffron-200 bg-gradient-saffron'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            isAdmin 
              ? 'bg-gradient-to-br from-white/20 to-white/10 border-white/30' 
              : 'bg-gradient-to-br from-white/30 to-white/20 border-white/40'
          }`}>
            {isAdmin ? (
              <Building2 className="w-6 h-6 text-white" />
            ) : (
              <span className="text-2xl">🧁</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className={`text-xl font-bold ${
              isAdmin ? 'text-white' : 'text-orange-900'
            }`}>
              {isAdmin ? 'Panel Administrativo' : 'Dulces Momentos'}
            </h1>
            <p className={`text-sm mt-1 truncate ${
              isAdmin ? 'text-purple-100' : 'text-orange-800'
            }`}>
              Hola, {firestoreUser?.name || firestoreUser?.email?.split('@')[0] || 'Usuario'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => {
                  const baseClasses = "flex items-center px-4 py-3 rounded-xl transition-all duration-300";
                  
                  if (isActive) {
                    return `${baseClasses} ${
                      isAdmin 
                        ? 'bg-gradient-purple text-white shadow-purple border-r-4 border-white transform scale-105' 
                        : 'bg-gradient-saffron text-orange-900 shadow-saffron border-r-4 border-orange-600 transform scale-105'
                    }`;
                  }
                  
                  return `${baseClasses} ${
                    isAdmin 
                      ? 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:scale-105' 
                      : 'text-gray-700 hover:bg-saffron-50 hover:text-saffron-700 hover:scale-105'
                  }`;
                }}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer Section */}
      <div className={`p-4 border-t ${
        isAdmin 
          ? 'border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50' 
          : 'border-saffron-200 bg-gradient-to-r from-saffron-50 to-orange-50'
      }`}>
        <button
          onClick={logout}
          className={`w-full flex items-center justify-center ${
            isAdmin ? 'btn-admin' : 'btn-outline text-gray-700 hover:text-saffron-700'
          }`}
        >
          <LogOut size={20} className="mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default WebSidebar;