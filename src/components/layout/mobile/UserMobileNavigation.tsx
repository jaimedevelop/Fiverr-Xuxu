import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Compass, 
  Package, 
  User,
  LogOut
} from 'lucide-react';

const UserMobileNavigation: React.FC = () => {
  const { logout } = useAuth();

  const userNavItems = [
    { path: '/user/explore', label: 'Explorar', icon: Compass },
    { path: '/user/orders', label: 'Ordenes', icon: Package },
    { path: '/user/profile', label: 'Perfil', icon: User },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
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
  );
};

export default UserMobileNavigation;