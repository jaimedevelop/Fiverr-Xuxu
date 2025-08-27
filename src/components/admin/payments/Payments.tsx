import React, { useState } from 'react';
import { CreditCard, List, Settings, DollarSign, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import PaymentMethods from './PaymentMethods';
import PaymentTransactions from './PaymentTransactions';
import PaymentSettings from './PaymentSettings';
import BaseCard from '../../../components/common/BaseCard';

interface PaymentsProps {
  loading?: boolean;
  error?: string | null;
}

const Payments: React.FC<PaymentsProps> = ({ 
  loading = false, 
  error = null 
}) => {
  const [activeTab, setActiveTab] = useState<'methods' | 'transactions' | 'settings'>('methods');

  const tabs = [
    {
      id: 'methods' as const,
      name: 'Métodos de Pago',
      icon: CreditCard,
      description: 'Configura los métodos disponibles',
      color: 'saffron'
    },
    {
      id: 'transactions' as const,
      name: 'Transacciones',
      icon: List,
      description: 'Historial de pagos y cobros',
      color: 'mint'
    },
    {
      id: 'settings' as const,
      name: 'Configuración',
      icon: Settings,
      description: 'Ajustes generales de pagos',
      color: 'purple'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="card-base p-8 max-w-sm mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-saffron rounded-full flex items-center justify-center animate-pulse">
              <DollarSign className="w-8 h-8 text-orange-900" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <p className="text-gray-600 font-medium">Cargando sistema de pagos...</p>
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
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-saffron rounded-2xl flex items-center justify-center shadow-brand-lg">
                <DollarSign className="w-8 h-8 text-orange-900" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Sistema de Pagos
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Gestiona métodos de pago, transacciones y configuración financiera
                </p>
                
                {/* Payment Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-900 text-sm">Pagos Seguros</h3>
                        <p className="text-xs text-emerald-700">Múltiples métodos disponibles</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 text-sm">Transacciones</h3>
                        <p className="text-xs text-blue-700">Historial completo de pagos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-900 text-sm">Configuración</h3>
                        <p className="text-xs text-purple-700">Ajustes personalizados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="card-base p-6 bg-red-50 border-red-200 border">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Error en el Sistema de Pagos</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Features Overview */}
          <div className="card-base p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Características del Sistema</h2>
                <p className="text-gray-600 text-sm">Todo lo que necesitas para gestionar pagos eficientemente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-emerald-900">Múltiples Métodos</h3>
                </div>
                <p className="text-sm text-emerald-800">Tarjetas, efectivo, transferencias y billeteras digitales</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <List className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900">Historial Completo</h3>
                </div>
                <p className="text-sm text-blue-800">Seguimiento detallado de todas las transacciones</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-purple-900">Configuración Avanzada</h3>
                </div>
                <p className="text-sm text-purple-800">Personaliza límites, monedas y proveedores</p>
              </div>

              <div className="bg-gradient-to-br from-saffron-50 to-orange-50 border border-saffron-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-orange-900">Reportes</h3>
                </div>
                <p className="text-sm text-orange-800">Análisis de ventas y rendimiento financiero</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="card-base p-6">
            <div className="border-b border-gray-200">
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
                          ? 'border-saffron-500 text-saffron-700 bg-saffron-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-saffron shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            isActive 
                              ? 'text-orange-900' 
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
            <div className="mt-8">
              {activeTab === 'methods' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-orange-900" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Métodos de Pago
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Configura y gestiona los métodos de pago disponibles
                      </p>
                    </div>
                  </div>
                  
                  <PaymentMethods loading={loading} error={error} />
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-mint rounded-lg flex items-center justify-center">
                      <List className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Historial de Transacciones
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Revisa todas las transacciones y pagos procesados
                      </p>
                    </div>
                  </div>
                  
                  <PaymentTransactions loading={loading} error={error} />
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Configuración de Pagos
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Ajusta la configuración general del sistema de pagos
                      </p>
                    </div>
                  </div>
                  
                  <PaymentSettings loading={loading} error={error} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;