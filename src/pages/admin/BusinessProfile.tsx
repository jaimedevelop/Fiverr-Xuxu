import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Business, OperatingHours } from '../../types/business';
import BusinessProfileComponent from '../../components/admin/business/BusinessProfile';
import FormError from '../../components/common/FormError';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BusinessProfile: React.FC = () => {
  const {
    business,
    loading,
    error,
    fetchBusiness,
    updateBusiness,
    updateOperatingHours
  } = useBusiness();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      fetchBusiness();
      setIsInitialized(true);
    }
  }, [isInitialized, fetchBusiness]);

  const handleUpdateBusiness = (businessData: Partial<Business>) => {
    updateBusiness(businessData);
  };

  const handleUpdateOperatingHours = (operatingHours: OperatingHours) => {
    updateOperatingHours(operatingHours);
  };

  // Mock data for development
  const mockBusiness: Business = {
    id: 'business1',
    storeName: 'Pastelería Delicias',
    accountManager: 'Juan Pérez',
    email: 'contacto@pasteleriadelicias.com',
    phone: '+52 55 1234 5678',
    address: {
      street: 'Av. Principal',
      colonia: 'Centro',
      municipality: 'Ciudad de México',
      postalCode: '06000',
      state: 'CDMX'
    },
    logoUrl: 'https://via.placeholder.com/150',
    operatingHours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '15:00' },
      sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Perfil del Negocio</h1>
        <p className="text-gray-600">Administra la información y configuración de tu negocio</p>
      </div>

      {error && <div className="mb-6"><FormError message={error} /></div>}

      {loading && !business ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <BusinessProfileComponent
          business={business || mockBusiness}
          onUpdateBusiness={handleUpdateBusiness}
          onUpdateOperatingHours={handleUpdateOperatingHours}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default BusinessProfile;