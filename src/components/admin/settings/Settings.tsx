import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Shield, Database } from 'lucide-react';
import GeneralSettings from './GeneralSettings';
import UserSettings from './UserSettings';
import BaseCard from '../../../components/common/BaseCard';

interface SettingsProps {
  loading?: boolean;
  error?: string | null;
}

const SettingsComponent: React.FC<SettingsProps> = ({
  loading = false,
  error = null
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security'>('general');

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Gestiona la configuración de tu negocio y usuarios</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <SettingsIcon className="h-4 w-4 mr-2" />
              General
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </div>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Seguridad
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'general' && (
        <GeneralSettings loading={loading} error={error} />
      )}

      {activeTab === 'users' && (
        <UserSettings loading={loading} error={error} />
      )}

      {activeTab === 'security' && (
        <BaseCard title="Configuración de Seguridad">
          <div className="bg-blue-50 p-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Configuración de Seguridad</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Esta sección estará disponible próximamente. Aquí podrás configurar opciones de seguridad 
                    como autenticación de dos factores, políticas de contraseñas y permisos de acceso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      )}
    </div>
  );
};

export default SettingsComponent;