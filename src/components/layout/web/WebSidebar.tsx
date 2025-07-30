import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
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
  const { user, logout } = useAuth();

  const userNavItems = [
    { path: '/user/menu', label: 'Menu', icon: Menu },
    { path: '/user/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/user/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/menu-management', label: 'Menu Management', icon: Menu },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/admin/inventory', label: 'Inventory', icon: Package },
    { path: '/admin/business-profile', label: 'Business Profile', icon: Building2 },
    { path: '/admin/promotions', label: 'Promotions', icon: Megaphone },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'Admin Panel' : 'Restaurant App'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
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
          Logout
        </button>
      </div>
    </aside>
  );
};

export default WebSidebar;