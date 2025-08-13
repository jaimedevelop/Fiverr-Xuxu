// src/pages/auth/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <AuthLayout showBackButton={false}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenido a Dulces Moment
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Selecciona tu tipo de acceso
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => navigate('/acceso-admin')}
                variant="outline"
                className="w-full py-3"
              >
                Acceso de Administrador
              </Button>
              
              <Button
                onClick={() => navigate('/acceso-usuario')}
                className="w-full py-3"
              >
                Acceso de Usuario
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Eres nuevo?</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => navigate('/registro-negocio')}
                variant="outline"
                className="w-full py-3"
              >
                Registrar mi Negocio
              </Button>
              
              <Button
                onClick={handleRegisterUser}
                variant="outline"
                className="w-full py-3"
              >
                Crear Cuenta de Usuario
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthPage;