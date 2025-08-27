import React, { useState, useEffect } from 'react';
import { Business } from '../../../types/business';
import BusinessInfo from './BusinessInfo';
import OperatingHours from './OperatingHours';
import BaseCard from '../../../components/common/BaseCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import FormError from '../../../components/common/FormError';
import { Building2 } from 'lucide-react';

interface BusinessProfileProps {
  business: Business | null;
  onUpdateBusiness: (business: Partial<Business>) => void;
  onUpdateOperatingHours: (operatingHours: any) => void;
  loading?: boolean;
  error?: string | null;
}

const BusinessProfile: React.FC<BusinessProfileProps> = ({ 
  business, 
  onUpdateBusiness, 
  onUpdateOperatingHours,
  loading = false,
  error = null
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'hours'>('info');

  if (loading && !business) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Cargando perfil del negocio...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="card-base shadow-brand-lg">
        <div className="p-8">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Perfil del Negocio</h3>
            <p className="text-gray-500">No se encontró información del negocio.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}

      <div className="card-base shadow-brand-lg overflow-hidden">
        <div className="bg-gradient-main px-8 py-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Perfil del Negocio</h1>
          <p className="text-gray-600 mt-2">Administra la información y configuración de tu negocio</p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-2 border-b-2 font-bold text-base transition-all duration-200 ${
                activeTab === 'info'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`py-4 px-2 border-b-2 font-bold text-base transition-all duration-200 ${
                activeTab === 'hours'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Horarios de Operación
            </button>
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'info' && (
            <BusinessInfo
              business={business}
              onUpdate={onUpdateBusiness}
              loading={loading}
            />
          )}

          {activeTab === 'hours' && (
            <OperatingHours
              business={business}
              onUpdate={onUpdateOperatingHours}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;