/ src/components/user/common/AuthPromptModal.tsx
import React from 'react';
import { X, UserPlus } from 'lucide-react';

interface AuthPromptModalProps {
  onClose: () => void;
  message: string;
}

const AuthPromptModal = ({ onClose, message }: AuthPromptModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-base max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-charcoal">Iniciar Sesión</h3>
          <button
            onClick={onClose}
            className="text-slate hover:text-charcoal transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-slate">{message}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="btn-outline flex-1"
          >
            Cancelar
          </button>
          <button className="btn-primary flex-1 gap-2">
            <UserPlus size={16} />
            Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;