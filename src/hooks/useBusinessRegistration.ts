// src/hooks/useBusinessRegistration.ts
import { useState } from 'react';
import { BusinessRegistrationData } from '../types/business';
import { registerBusiness } from '../services/businessService';

export const useBusinessRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (formData: BusinessRegistrationData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await registerBusiness(formData);
      setSuccess(true);
      return result;
    } catch (err: any) {
      setError(err.message || 'Error al registrar el negocio');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    register
  };
};