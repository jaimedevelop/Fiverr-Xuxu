// src/components/user/auth/AuthPromptModal.tsx
import React, { useState } from 'react';
import { X, User, UserPlus, LogIn } from 'lucide-react';
import Button from '../../ui/Button';
import BaseCard from '../../common/BaseCard';
import UserRegistrationForm from '../registration/UserRegistrationForm';
import UserLoginForm from './UserLoginForm';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestCheckout: () => void;
}

type AuthMode = 'prompt' | 'login' | 'register';

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  onGuestCheckout 
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('prompt');

  if (!isOpen) return null;

  const handleBackToPrompt = () => {
    setAuthMode('prompt');
  };

  const renderPromptCards = () => (
    <div className="space-y-4">
      {/* Have an Account Card */}
      <BaseCard>
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¿Tienes cuenta?
          </h3>
          <p className="text-gray-600 mb-4">
            Inicia sesión para ver tu historial de pedidos y direcciones guardadas
          </p>
          <Button
            onClick={() => setAuthMode('login')}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </div>
      </BaseCard>

      {/* Guest Checkout Card */}
      <BaseCard>
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Continuar como invitado
          </h3>
          <p className="text-gray-600 mb-4">
            Completa tu pedido sin crear una cuenta
          </p>
          <Button
            onClick={onGuestCheckout}
            variant="outline"
            className="w-full"
          >
            Continuar sin cuenta
          </Button>
        </div>
      </BaseCard>

      {/* Create Account Card */}
      <BaseCard>
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <UserPlus className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Crear cuenta nueva
          </h3>
          <p className="text-gray-600 mb-4">
            Guarda tus direcciones y accede a ofertas especiales
          </p>
          <Button
            onClick={() => setAuthMode('register')}
            variant="outline"
            className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            Crear Cuenta
          </Button>
        </div>
      </BaseCard>
    </div>
  );

  const renderLoginForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBackToPrompt}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Volver
        </button>
        <h3 className="text-xl font-semibold text-gray-900">
          Iniciar Sesión
        </h3>
        <div></div>
      </div>
      <UserLoginForm onSuccess={onClose} />
    </div>
  );

  const renderRegisterForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBackToPrompt}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Volver
        </button>
        <h3 className="text-xl font-semibold text-gray-900">
          Crear Cuenta
        </h3>
        <div></div>
      </div>
      <UserRegistrationForm onSuccess={onClose} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {authMode === 'prompt' ? 'Finalizar Pedido' : 
             authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {authMode === 'prompt' && renderPromptCards()}
          {authMode === 'login' && renderLoginForm()}
          {authMode === 'register' && renderRegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;