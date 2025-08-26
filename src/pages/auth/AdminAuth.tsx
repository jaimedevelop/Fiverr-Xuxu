// src/pages/auth/AdminAuth.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Store, Sparkles } from 'lucide-react';
import AdminAuthForm from '../../components/auth/AdminAuthForm';

const AdminAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-cyan-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 via-transparent to-pink-100/20"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full opacity-25 animate-pulse delay-300"></div>
      <div className="absolute bottom-40 right-10 w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-20 animate-bounce delay-700"></div>
      
      <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/iniciar-sesion"
              className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Volver</span>
            </Link>
          </div>

          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent mb-2">
              Portal de Negocios
            </h1>
            <p className="text-lg text-gray-600 mb-2">Dulces Momentos</p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
              <span>Administra tu pastelería</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Acceso de Administrador
              </h2>
              <p className="text-gray-600">
                Inicia sesión para gestionar tu negocio
              </p>
            </div>

            {/* Auth Form */}
            <div className="mb-6">
              <AdminAuthForm />
            </div>

            {/* Registration Link */}
            <div className="text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    ¿Nuevo en Dulces Momentos?
                  </span>
                </div>
              </div>
              
              <Link 
                to="/registro-negocio" 
                className="group inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md border border-purple-200"
              >
                <Store className="w-5 h-5 mr-2" />
                <span>Registrar mi Negocio</span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <span className="mr-1">Hecho con</span>
              <span className="text-red-400 mx-1">❤️</span>
              <span>para pasteleros profesionales</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;