import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Business, OperatingHours } from '../types/business';
import { registerBusiness } from '../services/businessService';
import { useAuth } from './AuthContext';

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  error: string | null;
  fetchBusiness: () => void;
  updateBusiness: (businessData: Partial<Business>) => void;
  updateOperatingHours: (operatingHours: OperatingHours) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const user = authState.user;
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async () => {
    if (!user?.businessId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll just set a mock business since the service doesn't have a getBusinessById method
      const mockBusiness: Business = {
        id: user.businessId,
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
      
      setBusiness(mockBusiness);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la información del negocio');
      console.error('Error fetching business:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (businessData: Partial<Business>) => {
    if (!business?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll just update the local state since the service doesn't have an updateBusiness method
      setBusiness(prev => prev ? { ...prev, ...businessData, updatedAt: new Date() } : null);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la información del negocio');
      console.error('Error updating business:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOperatingHours = async (operatingHours: OperatingHours) => {
    if (!business?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll just update the local state since the service doesn't have an updateOperatingHours method
      setBusiness(prev => prev ? { ...prev, operatingHours, updatedAt: new Date() } : null);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar los horarios de operación');
      console.error('Error updating operating hours:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    business,
    loading,
    error,
    fetchBusiness,
    updateBusiness,
    updateOperatingHours,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};