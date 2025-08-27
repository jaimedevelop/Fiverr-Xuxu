// src/components/admin/settings/SettingsComponent.tsx - Theme Converted
import React, { useState } from 'react';
import { User as UserIcon, Bell, Clock, Settings as SettingsIcon, AlertCircle, Building2, Sparkles } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
      description: 'Información personal y perfil',
      color: 'saffron'
    },
    {
      id: 'notifications' as const,
      name: 'Notificaciones',
      icon: Bell,
      description: 'Configuración de mensajes y alertas',
      color: 'mint'
    },
    {
      id: 'orders' as const,
      name: 'Pedidos',
      icon: Clock,
      description: 'Horarios y lógica de pedidos',
      color: 'purple'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="card-base p-8 max-w-sm mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-saffron rounded-full flex items-center justify-center animate-pulse">
              <SettingsIcon className="w-8 h-8 text-orange-900" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <p className="text-gray-600 font-medium">Cargando configuración...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="card-base p-6 sm:p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-saffron rounded-2xl flex items-center justify-center shadow-brand-lg">
                <SettingsIcon className="w-8 h-8 text-orange-900" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Configuración
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Gestiona la configuración de tu negocio y cuenta personal
                </p>
                
                {/* Business Info Banner */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900">Panel de Administración</h3>
                      <p className="text-sm text-purple-700">
                        Configura todos los aspectos de tu negocio desde este panel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Info Card */}
            {user && (
              <div className="bg-gradient-to-r from-saffron-50 to-orange-50 border border-saffron-200 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center shadow-brand-lg">
                    <UserIcon className="w-6 h-6 text-orange-900" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <span className="badge-admin text-xs">
                        {user.role === 'admin' ? 'Administrador' : 
                         user.role === 'manager' ? 'Gerente' : 'Empleado'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                    {firestoreUser?.businessId && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-purple-700 font-mono text-xs">
                          Business ID: {firestoreUser.businessId.slice(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="card-base p-6 bg-red-50 border-red-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Error de Configuración</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Navigation and Content */}
          <div className="card-base p-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-6 border-b-3 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-t-xl ${
                        isActive
                          ? 'border-purple-500 text-purple-700 bg-purple-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-br from-purple-100 to-purple-200 shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isActive 
                              ? 'text-purple-700' 
                              : 'text-gray-500 group-hover:text-gray-700'
                          }`} />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{tab.name}</div>
                          <div className="text-xs text-gray-500 font-normal hidden md:block">
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
            <div className="min-h-[600px]">
              {activeTab === 'account' && user && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-orange-900" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Configuración de Cuenta
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Gestiona tu información personal y configuración del perfil
                      </p>
                    </div>
                  </div>
                  <AccountSettings user={user} loading={loading} />
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-mint rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Configuración de Notificaciones
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Controla cómo y cuándo recibes notificaciones del sistema
                      </p>
                    </div>
                  </div>
                  <NotificationsSettings loading={loading} error={error} />
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Configuración de Pedidos
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Configura horarios y reglas para el procesamiento de pedidos
                      </p>
                    </div>
                  </div>

                  {/* Order Settings Info Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">
                          Gestión Inteligente de Pedidos
                        </h3>
                        <p className="text-purple-800 leading-relaxed mb-4">
                          Configura cómo se manejan los pedidos según el horario en que los clientes los realizan. 
                          Puedes establecer reglas para pedidos matutinos prioritarios, cortes de horario para 
                          el siguiente día, y opciones de cola para pedidos fuera del horario comercial.
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-purple-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Sistema optimizado para pastelerías</span>
                        </div>
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
                  <div className="card-base p-6 bg-gradient-to-br from-gray-50 to-blue-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      Consejos de Configuración
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">💡</div>
                          <h4 className="font-semibold text-emerald-800">
                            Pedidos Prioritarios
                          </h4>
                        </div>
                        <p className="text-sm text-emerald-700">
                          Los pedidos realizados en la mañana pueden procesarse más rápido 
                          y estar listos hasta las 3pm del mismo día.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">⏰</div>
                          <h4 className="font-semibold text-amber-800">
                            Horario de Corte
                          </h4>
                        </div>
                        <p className="text-sm text-amber-700">
                          Los pedidos después de las 5pm se programan para el siguiente día, 
                          garantizando mejor calidad y planificación.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">📅</div>
                          <h4 className="font-semibold text-purple-800">
                            Cola de Pedidos
                          </h4>
                        </div>
                        <p className="text-sm text-purple-700">
                          Permite que los clientes hagan pedidos incluso cuando estás cerrado. 
                          Los pedidos se procesan al abrir el siguiente día.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">🎯</div>
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