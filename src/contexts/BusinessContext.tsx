// src/contexts/BusinessContext.tsx - Enhanced with debug logging
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Business, OperatingHours } from '../types/business';
import { useUser } from './UserContext';
import { db } from '../firebase/config';

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  error: string | null;
  fetchBusiness: () => Promise<void>;
  updateBusiness: (businessData: Partial<Business>) => Promise<void>;
  updateOperatingHours: (operatingHours: OperatingHours) => Promise<void>;
  refreshBusiness: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = (): BusinessContextType => {
  console.log('🎣 useBusiness: Hook called');
  const context = useContext(BusinessContext);
  
  if (!context) {
    console.error('❌ useBusiness: Context is undefined - BusinessProvider not found in component tree');
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  
  console.log('✅ useBusiness: Context found:', {
    hasBusiness: !!context.business,
    businessId: context.business?.id,
    loading: context.loading,
    error: context.error
  });
  
  return context;
};

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  console.log('🏢 BusinessProvider: Initializing...');
  
  const { user, loading: userLoading } = useUser();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('🏢 BusinessProvider: Current state:', {
    userLoading,
    user: user ? {
      uid: user.uid,
      email: user.email,
      role: user.role,
      businessId: user.businessId
    } : null,
    hasBusiness: !!business,
    businessLoading: loading,
    businessError: error
  });

  // Helper function to fetch business data from Firestore
  const fetchBusinessData = async (businessId: string): Promise<Business | null> => {
    console.log('🔍 BusinessProvider: fetchBusinessData called with ID:', businessId);
    
    try {
      console.log('⏳ BusinessProvider: Fetching business document from Firestore...');
      const businessDoc = await getDoc(doc(db, 'businesses', businessId));
      
      if (businessDoc.exists()) {
        console.log('✅ BusinessProvider: Business document found');
        const businessData = businessDoc.data();
        console.log('📄 BusinessProvider: Raw business data:', businessData);
        
        const processedBusiness: Business = {
          id: businessDoc.id,
          storeName: businessData.storeName || '',
          accountManager: businessData.accountManager || '',
          email: businessData.email || user?.email || '',
          phone: businessData.phone || '',
          address: businessData.address || {
            street: '',
            colonia: '',
            municipality: '',
            postalCode: '',
            state: ''
          },
          logoUrl: businessData.logoUrl || '',
          operatingHours: businessData.operatingHours || {
            monday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
            tuesday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
            wednesday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
            thursday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
            friday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
            saturday: { isOpen: false, openTime: '00:00', closeTime: '00:00' },
            sunday: { isOpen: false, openTime: '00:00', closeTime: '00:00' }
          },
          createdAt: businessData.createdAt?.toDate() || new Date(),
          updatedAt: businessData.updatedAt?.toDate() || new Date(),
          isActive: businessData.isActive ?? true
        };
        
        console.log('✅ BusinessProvider: Processed business data:', processedBusiness);
        return processedBusiness;
      } else {
        console.error('❌ BusinessProvider: Business document not found in Firestore');
        throw new Error('Business not found');
      }
    } catch (error) {
      console.error('❌ BusinessProvider: Error fetching business data:', error);
      throw error;
    }
  };

  // Automatically fetch business data when user is available and has businessId
  useEffect(() => {
    console.log('🔄 BusinessProvider: useEffect triggered', {
      userLoading,
      hasUser: !!user,
      userBusinessId: user?.businessId
    });
    
    const loadBusinessData = async () => {
      // Don't proceed if user is still loading
      if (userLoading) {
        console.log('⏳ BusinessProvider: User still loading, skipping business fetch');
        return;
      }

      // Clear business data if no user or no businessId
      if (!user || !user.businessId) {
        console.log('🧹 BusinessProvider: Clearing business data (no user or businessId)');
        setBusiness(null);
        setLoading(false);
        setError(null);
        return;
      }

      console.log('🚀 BusinessProvider: Starting business data load for businessId:', user.businessId);
      setLoading(true);
      setError(null);

      try {
        const businessData = await fetchBusinessData(user.businessId);
        console.log('✅ BusinessProvider: Business data loaded successfully');
        setBusiness(businessData);
      } catch (err: any) {
        const errorMessage = 'Failed to load business data: ' + err.message;
        console.error('❌ BusinessProvider: Error loading business:', err);
        setError(errorMessage);
        setBusiness(null);
      } finally {
        setLoading(false);
        console.log('🏁 BusinessProvider: Business loading complete');
      }
    };

    loadBusinessData();
  }, [user, userLoading]);

  const fetchBusiness = async () => {
    console.log('🔄 BusinessProvider: fetchBusiness called manually');
    
    if (!user?.businessId) {
      const errorMessage = 'No business ID found for user';
      console.error('❌ BusinessProvider:', errorMessage);
      setError(errorMessage);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const businessData = await fetchBusinessData(user.businessId);
      setBusiness(businessData);
      console.log('✅ BusinessProvider: Manual fetch completed successfully');
    } catch (err: any) {
      const errorMessage = 'Failed to fetch business data: ' + err.message;
      setError(errorMessage);
      console.error('❌ BusinessProvider: Manual fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (businessData: Partial<Business>) => {
    console.log('📝 BusinessProvider: updateBusiness called with:', businessData);
    
    if (!business?.id) {
      const errorMessage = 'No business loaded to update';
      console.error('❌ BusinessProvider:', errorMessage);
      throw new Error(errorMessage);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('⏳ BusinessProvider: Updating business in Firestore...');
      // Update business data in Firestore
      const businessRef = doc(db, 'businesses', business.id);
      const updateData = {
        ...businessData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(businessRef, updateData);
      console.log('✅ BusinessProvider: Firestore update successful');
      
      // Update local state
      setBusiness(prev => prev ? { 
        ...prev, 
        ...businessData, 
        updatedAt: new Date() 
      } : null);
      
      console.log('✅ BusinessProvider: Local state updated');
    } catch (err: any) {
      const errorMessage = 'Failed to update business: ' + err.message;
      setError(errorMessage);
      console.error('❌ BusinessProvider: Update failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOperatingHours = async (operatingHours: OperatingHours) => {
    console.log('⏰ BusinessProvider: updateOperatingHours called with:', operatingHours);
    
    if (!business?.id) {
      const errorMessage = 'No business loaded to update';
      console.error('❌ BusinessProvider:', errorMessage);
      throw new Error(errorMessage);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('⏳ BusinessProvider: Updating operating hours in Firestore...');
      // Update operating hours in Firestore
      const businessRef = doc(db, 'businesses', business.id);
      const updateData = {
        operatingHours,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(businessRef, updateData);
      console.log('✅ BusinessProvider: Operating hours Firestore update successful');
      
      // Update local state
      setBusiness(prev => prev ? { 
        ...prev, 
        operatingHours, 
        updatedAt: new Date() 
      } : null);
      
      console.log('✅ BusinessProvider: Operating hours local state updated');
    } catch (err: any) {
      const errorMessage = 'Failed to update operating hours: ' + err.message;
      setError(errorMessage);
      console.error('❌ BusinessProvider: Operating hours update failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshBusiness = async () => {
    console.log('🔄 BusinessProvider: refreshBusiness called');
    
    if (!user?.businessId) {
      console.log('⚠️ BusinessProvider: No businessId to refresh');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const businessData = await fetchBusinessData(user.businessId);
      setBusiness(businessData);
      console.log('✅ BusinessProvider: Business refresh completed successfully');
    } catch (err: any) {
      const errorMessage = 'Failed to refresh business data: ' + err.message;
      setError(errorMessage);
      console.error('❌ BusinessProvider: Business refresh failed:', err);
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
    refreshBusiness,
  };

  console.log('🏢 BusinessProvider: Rendering with value:', {
    hasBusiness: !!business,
    businessId: business?.id,
    loading,
    error,
    hasFunctions: !!(fetchBusiness && updateBusiness && updateOperatingHours && refreshBusiness)
  });

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};