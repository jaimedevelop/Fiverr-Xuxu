// src/components/admin/settings/SettingsComponent.tsx - Simplified 3-Tab Structure with Polish
import React, { useState } from 'react';
import { User as UserIcon, Bell, Clock, Settings as SettingsIcon, AlertCircle } from 'lucide-react';
import BaseCard from '../../../components/common/BaseCard';
import User from '../../../types/user';
import { OrderSettings as OrderSettingsType, DEFAULT_ORDER_SETTINGS } from '../../../utils/orderScheduler';
import { useUser } from '../../../contexts/UserContext';
import AccountSettings from './AccountSettings';
import NotificationsSettings from './NotificationsSettings';
import OrderSettings from './OrderSettings';

interface SettingsProps {
  user: User | null;
  loading?: boolean;
  error?: string | null;
}

const SettingsComponent: React.FC<SettingsProps> = ({
  user,
  loading = false,
  error = null
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'orders'>('account');
  const { user: firestoreUser } = useUser();

  // Mock business data - In real app, fetch from business context/service
  const [businessOrderSettings, setBusinessOrderSettings] = useState<OrderSettingsType>(DEFAULT_ORDER_SETTINGS);

  const handleOrderSettingsSave = async (orderSettings: OrderSettingsType) => {
    try {
      // In real app, save to business service/API
      setBusinessOrderSettings(orderSettings);
      console.log('Saving order settings for business:', firestoreUser?.businessId, orderSettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically call your business service:
      // await businessService.updateOrderSettings(firestoreUser.businessId, orderSettings);
      
    } catch (err) {
      console.error('Error saving order settings:', err);
      throw err;
    }
  };

  const tabs = [
    {
      id: 'account' as const,
      name: 'Mi Cuenta',
      icon: UserIcon,
      description: 'Información personal y perfil'
    },
    {
      id: 'notifications' as const,
      name: 'Notificaciones',
      icon: Bell,
      description: 'Configuración de mensajes y alertas'
    },
    {
      id: 'orders' as const,
      name: 'Pedidos',
      icon: Clock,
      description: 'Horarios y lógica de pedidos'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-2 sm:p-2 lg:p-2">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Configuración
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  Gestiona la configuración de tu negocio y cuenta personal
                </p>
              </div>
            </div>
            
            {/* User Info */}
            {user && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                {firestoreUser?.businessId && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Business ID: {firestoreUser.businessId.slice(0, 8)}...</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {/* Settings Navigation and Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activeTab === tab.id 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            activeTab === tab.id 
                              ? 'text-blue-600' 
                              : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{tab.name}</div>
                          <div className="text-xs text-gray-400 font-normal hidden md:block">
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="min-h-[500px]">
              {activeTab === 'account' && user && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Configuración de Cuenta
                    </h2>
                    <p className="text-gray-600">
                      Gestiona tu información personal y configuración del perfil
                    </p>
                  </div>
                  <AccountSettings user={user} loading={loading} />
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Configuración de Notificaciones
                    </h2>
                    <p className="text-gray-600">
                      Controla cómo y cuándo recibes notificaciones del sistema
                    </p>
                  </div>
                  <NotificationsSettings loading={loading} error={error} />
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div className="space-y-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Configuración de Pedidos
                    </h2>
                    <p className="text-gray-600">
                      Configura horarios y reglas para el procesamiento de pedidos
                    </p>
                  </div>

                  {/* Order Settings Info Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Gestión Inteligente de Pedidos
                        </h3>
                        <p className="text-blue-700 leading-relaxed">
                          Configura cómo se manejan los pedidos según el horario en que los clientes los realizan. 
                          Puedes establecer reglas para pedidos matutinos prioritarios, cortes de horario para 
                          el siguiente día, y opciones de cola para pedidos fuera del horario comercial.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Settings Component */}
                  <OrderSettings
                    initialSettings={businessOrderSettings}
                    onSave={handleOrderSettingsSave}
                    loading={loading}
                    error={error}
                  />

                  {/* Quick Tips */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Consejos de Configuración
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-lg">💡</span>
                          </div>
                          <h4 className="font-semibold text-green-800">
                            Pedidos Prioritarios
                          </h4>
                        </div>
                        <p className="text-sm text-green-700">
                          Los pedidos realizados en la mañana (antes de 12pm) pueden procesarse más rápido 
                          y estar listos hasta las 3pm del mismo día.
                        </p>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <span className="text-amber-600 text-lg">⏰</span>
                          </div>
                          <h4 className="font-semibold text-amber-800">
                            Horario de Corte
                          </h4>
                        </div>
                        <p className="text-sm text-amber-700">
                          Los pedidos después de las 5pm se programan automáticamente para el siguiente día hábil, 
                          garantizando mejor calidad y planificación.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 text-lg">📅</span>
                          </div>
                          <h4 className="font-semibold text-purple-800">
                            Cola de Pedidos
                          </h4>
                        </div>
                        <p className="text-sm text-purple-700">
                          Permite que los clientes hagan pedidos incluso cuando estás cerrado. 
                          Los pedidos se procesan al abrir el siguiente día.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-lg">🎯</span>
                          </div>
                          <h4 className="font-semibold text-blue-800">
                            Tiempo de Anticipación
                          </h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          Establece cuánto tiempo necesitas entre que se hace el pedido y cuando debe estar listo 
                          para mantener la calidad de tus productos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;