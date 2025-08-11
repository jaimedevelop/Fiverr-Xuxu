// src/hooks/useBusinesses.ts
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Business } from '../types/business';

export interface BusinessFilter {
  search?: string;
  isOpen?: boolean;
  area?: string;
}

export const useBusinesses = (filters: BusinessFilter = {}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🏪 useBusinesses: Setting up businesses fetch with filters:', filters);
    
    setLoading(true);
    setError(null);

    // Build query
    let businessesQuery = query(
      collection(db, 'businesses'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    console.log('🔍 useBusinesses: Query built, setting up listener...');

    const unsubscribe = onSnapshot(
      businessesQuery,
      (snapshot) => {
        const businessesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Business;
        });

        console.log('✅ useBusinesses: Raw businesses loaded:', businessesData.length);

        // Apply client-side filters
        let filteredBusinesses = businessesData;

        // Search filter
        if (filters.search && filters.search.trim()) {
          const searchLower = filters.search.toLowerCase();
          filteredBusinesses = filteredBusinesses.filter(business => {
            return (
              business.storeName.toLowerCase().includes(searchLower) ||
              business.address.colonia.toLowerCase().includes(searchLower) ||
              business.address.municipality.toLowerCase().includes(searchLower)
            );
          });
        }

        // Area filter
        if (filters.area) {
          filteredBusinesses = filteredBusinesses.filter(business => 
            business.address.colonia.toLowerCase().includes(filters.area!.toLowerCase()) ||
            business.address.municipality.toLowerCase().includes(filters.area!.toLowerCase())
          );
        }

        // Open status filter would go here if needed
        // Note: This would require importing business hours utility and checking current time
        
        console.log(`🏪 useBusinesses: Filtered ${businessesData.length} → ${filteredBusinesses.length} businesses`);
        setBusinesses(filteredBusinesses);
        setLoading(false);
      },
      (error) => {
        console.error('❌ useBusinesses: Error loading businesses:', error);
        setError('Error al cargar los negocios');
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 useBusinesses: Cleaning up listener');
      unsubscribe();
    };
  }, [filters.search, filters.area, filters.isOpen]);

  return {
    businesses,
    loading,
    error,
  };
};