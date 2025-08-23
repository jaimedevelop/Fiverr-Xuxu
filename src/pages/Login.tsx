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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #E7FEFD 0%, white 100%)' }}>
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
        
        .login-card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(245, 203, 92, 0.15);
        }
        
        .welcome-header {
          color: var(--saffron-dark);
        }
        
        .welcome-subtitle {
          color: var(--persian-pink-dark);
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
        
        .btn-secondary {
          background-color: transparent;
          border: 2px solid var(--persian-pink);
          color: var(--persian-pink-dark);
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          background-color: var(--persian-pink-light);
          transform: translateY(-2px);
        }
        
        .icon-primary {
          color: white;
        }
        
        .icon-secondary {
          color: var(--persian-pink-dark);
        }
      `}</style>
      
      <div className="max-w-md w-full login-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold welcome-header mb-2">
            Bienvenido a Dulces Momentos
          </h1>
          <p className="welcome-subtitle">Selecciona tu tipo de acceso</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLoginNavigation('user')}
            className="btn-primary w-full flex items-center justify-center px-6 py-4 rounded-lg"
          >
            <User className="mr-3 icon-primary" size={24} />
            <div className="text-left">
              <div className="font-semibold">Acceso de Usuario</div>
              <div className="text-sm opacity-90">Explorar menú, hacer pedidos</div>
            </div>
          </button>
          
          <button
            onClick={() => handleLoginNavigation('admin')}
            className="btn-secondary w-full flex items-center justify-center px-6 py-4 rounded-lg"
          >
            <Shield className="mr-3 icon-secondary" size={24} />
            <div className="text-left">
              <div className="font-semibold">Acceso de Administrador</div>
              <div className="text-sm opacity-90">Gestionar operaciones del negocio</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;