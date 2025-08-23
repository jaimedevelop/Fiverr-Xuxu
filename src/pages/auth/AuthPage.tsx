// src/pages/auth/authPage.tsx
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
      <style jsx>{`
        :root {
          --saffron: #F5CB5C;
          --saffron-light: #F9E8B9;
          --saffron-dark: #E0B84F;
          --mint-green: #D9FCFB;
          --mint-green-light: #E7FEFD;
          --mint-green-dark: #B9E8E7;
          --persian-pink: #FF96D7;
          --persian-pink-light: #FFC5E9;
          --persian-pink-dark: #E674C0;
        }
        
        .auth-container {
          background: linear-gradient(135deg, var(--mint-green-light) 0%, white 100%);
          min-height: 100vh;
        }
        
        .welcome-header {
          color: var(--saffron-dark);
        }
        
        .welcome-subtitle {
          color: var(--persian-pink-dark);
        }
        
        .auth-card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(245, 203, 92, 0.15);
        }
        
        .btn-primary {
          background-color: var(--saffron);
          color: white;
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background-color: var(--saffron-dark);
          transform: translateY(-2px);
        }
        
        .btn-outline {
          background-color: transparent;
          border: 2px solid var(--persian-pink);
          color: var(--persian-pink-dark);
          transition: all 0.3s ease;
        }
        
        .btn-outline:hover {
          background-color: var(--persian-pink-light);
          transform: translateY(-2px);
        }
        
        .divider-text {
          color: var(--saffron-dark);
        }
        
        .divider-line {
          border-color: var(--mint-green-dark);
        }
      `}</style>
      
      <div className="auth-container sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold welcome-header">
          Bienvenido a Dulces Momentos
        </h2>
        <p className="mt-2 text-center text-sm welcome-subtitle">
          Selecciona tu tipo de acceso
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-card py-8 px-4 sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => navigate('/acceso-admin')}
                variant="outline"
                className="btn-outline w-full py-3"
              >
                Acceso de Administrador
              </Button>
              
              <Button
                onClick={() => navigate('/acceso-usuario')}
                className="btn-primary w-full py-3"
              >
                Acceso de Usuario
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t divider-line" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white divider-text">¿Eres nuevo?</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => navigate('/registro-negocio')}
                variant="outline"
                className="btn-outline w-full py-3"
              >
                Registrar mi Negocio
              </Button>
              
              <Button
                onClick={handleRegisterUser}
                variant="outline"
                className="btn-outline w-full py-3"
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