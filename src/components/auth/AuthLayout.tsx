// src/components/auth/AuthLayout.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonPath?: string;
}

const AuthLayout = ({ children, showBackButton = true, backButtonPath = '/iniciar-sesion' }: AuthLayoutProps) => {
  const navigate = useNavigate();
  console.log("AuthLayout component is being rendered");
  
  const handleBackClick = () => {
    if (backButtonPath) {
      navigate(backButtonPath);
    } else {
      navigate(-1); // Go back to previous page
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-main flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      {showBackButton && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-brand-lg hover:shadow-brand-xl hover:scale-105"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">Volver</span>
          </button>
        </div>
      )}
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-saffron bg-clip-text text-transparent">
            Dulces Momentos
          </h1>
          <p className="mt-3 text-base text-gray-600 font-medium">
            Registro de Negocio de Pastelería
          </p>
        </div>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card-base p-8 shadow-brand-xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;