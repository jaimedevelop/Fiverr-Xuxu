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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      {showBackButton && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 bg-white rounded-lg px-3 py-2 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Volver</span>
          </button>
        </div>
      )}
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dulces Momentos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Registro de Negocio de Pastelería
          </p>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;