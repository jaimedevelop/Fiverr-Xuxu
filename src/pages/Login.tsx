// src/components/auth/Login.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLoginNavigation = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      navigate('/acceso-admin');
    } else {
      navigate('/acceso-usuario');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Restaurant Management
          </h1>
          <p className="text-gray-600">Choose your access level</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLoginNavigation('user')}
            className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <User className="mr-3" size={24} />
            <div className="text-left">
              <div className="font-semibold">User Access</div>
              <div className="text-sm opacity-90">Browse menu, place orders</div>
            </div>
          </button>
          
          <button
            onClick={() => handleLoginNavigation('admin')}
            className="w-full flex items-center justify-center px-6 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <Shield className="mr-3" size={24} />
            <div className="text-left">
              <div className="font-semibold">Admin Access</div>
              <div className="text-sm opacity-90">Manage restaurant operations</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;