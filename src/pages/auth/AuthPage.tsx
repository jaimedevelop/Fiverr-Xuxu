// src/pages/auth/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, Plus, UserCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/auth/AuthLayout';

const AuthPage = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<'user' | 'admin'>('user');
  
  const handleRegisterUser = () => {
    console.log("Register user button clicked, navigating to /registro-usuario");
    navigate('/registro-usuario');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-cyan-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 via-transparent to-pink-100/20"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full opacity-25 animate-pulse delay-300"></div>
      <div className="absolute bottom-40 right-10 w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-20 animate-bounce delay-700"></div>
      
      <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-300 via-orange-300 to-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-3xl">🧁</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 bg-clip-text text-transparent mb-3">
              Dulces Momentos
            </h1>
            <p className="text-sm text-gray-500">
              Tu marketplace de postres favorito
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Bienvenido!
              </h2>
              <p className="text-gray-600">
                Selecciona tu tipo de acceso
              </p>
            </div>

            <div className="space-y-4">
              {/* Admin Access */}
              <button
                onClick={() => navigate('/acceso-admin')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl px-6 py-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  <Store className="mr-3 w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold text-lg">Soy Negocio</div>
                    <div className="text-sm opacity-90">Administrar mi pastelería</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </button>

              {/* User Access */}
              <button
                onClick={() => navigate('/acceso-usuario')}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-orange-900 rounded-xl px-6 py-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  <User className="mr-3 w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold text-lg">Soy Cliente</div>
                    <div className="text-sm opacity-90">Explorar y pedir postres</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  ¿Eres nuevo?
                </span>
              </div>
            </div>

            {/* Registration Options */}
            <div className="space-y-3">
              {/* Register Business */}
              <button
                onClick={() => navigate('/registro-negocio')}
                className="w-full group bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-cyan-50 text-gray-700 rounded-xl px-6 py-3 border-2 border-gray-200 hover:border-pink-200 shadow-sm transform transition-all duration-300 hover:scale-102 hover:shadow-md"
              >
                <div className="flex items-center justify-center">
                  <Plus className="mr-2 w-5 h-5 text-purple-500" />
                  <span className="font-medium">Registrar mi Negocio</span>
                </div>
              </button>

              {/* Register User */}
              <button
                onClick={handleRegisterUser}
                className="w-full group bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 text-gray-700 rounded-xl px-6 py-3 border-2 border-gray-200 hover:border-yellow-200 shadow-sm transform transition-all duration-300 hover:scale-102 hover:shadow-md"
              >
                <div className="flex items-center justify-center">
                  <UserCheck className="mr-2 w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Crear Cuenta de Usuario</span>
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Hecho con ❤️ para los amantes de los dulces
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;