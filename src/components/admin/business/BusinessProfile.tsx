import React, { useState, useEffect } from 'react';
import { Business } from '../../../types/business';
import BusinessInfo from './BusinessInfo';
import OperatingHours from './OperatingHours';
import BaseCard from '../../../components/common/BaseCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import FormError from '../../../components/common/FormError';

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
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!business) {
    return (
      <BaseCard title="Perfil del Negocio">
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontró información del negocio.</p>
        </div>
      </BaseCard>
    );
  }

  return (
    <div className="space-y-6">
      {error && <FormError message={error} />}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hours'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Horarios de Operación
          </button>
        </nav>
      </div>

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
  );
};

export default BusinessProfile;