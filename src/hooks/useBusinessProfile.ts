// src/hooks/useBusinessProfile.ts
import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Business } from '../types/business';

export const useBusinessProfile = (businessId: string | undefined) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      console.log('🏪 useBusinessProfile: No businessId provided');
      setBusiness(null);
      setLoading(false);
      setError('No business ID provided');
      return;
    }

    console.log('🏪 useBusinessProfile: Setting up business fetch for ID:', businessId);
    
    setLoading(true);
    setError(null);

    // Set up real-time listener for business document
    const businessRef = doc(db, 'businesses', businessId);
    
    const unsubscribe = onSnapshot(
      businessRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const businessData: Business = {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Business;

          console.log('✅ useBusinessProfile: Business loaded:', businessData.storeName);
          setBusiness(businessData);
        } else {
          console.error('❌ useBusinessProfile: Business not found');
          setBusiness(null);
          setError('Negocio no encontrado');
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ useBusinessProfile: Error loading business:', error);
        setError('Error al cargar la información del negocio');
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 useBusinessProfile: Cleaning up listener');
      unsubscribe();
    };
  }, [businessId]);

  return {
    business,
    loading,
    error,
  };
};