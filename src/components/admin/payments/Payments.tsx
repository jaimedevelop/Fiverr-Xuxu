import React, { useState } from 'react';
import { CreditCard, List, Settings } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
        <p className="text-gray-600">Gestiona los métodos de pago y transacciones</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('methods')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'methods'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Métodos de Pago
            </div>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <List className="h-4 w-4 mr-2" />
              Transacciones
            </div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </div>
          </button>
        </nav>
      </div>

      {activeTab === 'methods' && (
        <PaymentMethods loading={loading} error={error} />
      )}

      {activeTab === 'transactions' && (
        <PaymentTransactions loading={loading} error={error} />
      )}

      {activeTab === 'settings' && (
        <PaymentSettings loading={loading} error={error} />
      )}
    </div>
  );
};

export default Payments;