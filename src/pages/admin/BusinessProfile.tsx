// src/pages/admin/BusinessProfile.tsx - Compatible with your existing BusinessContext
import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { useUser } from '../../contexts/UserContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FormError from '../../components/common/FormError';
import BusinessProfileComponent from '../../components/admin/business/BusinessProfile';
import { Business, OperatingHours } from '../../types/business';

const BusinessProfile: React.FC = () => {
  console.log('🚀 BusinessProfile: Component rendering');
  
  // Get user context first
  const { user, loading: userLoading } = useUser();
  console.log('👤 BusinessProfile: User state:', {
    user: user ? {
      uid: user.uid,
      email: user.email,
      role: user.role,
      businessId: user.businessId
    } : null,
    userLoading
  });

  // Check if useBusiness hook is available
  let businessContextResult;
  try {
    businessContextResult = useBusiness();
    console.log('✅ BusinessProfile: useBusiness hook successful');
  } catch (error) {
    console.error('❌ BusinessProfile: useBusiness hook failed:', error);
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Context Error:</strong> BusinessProvider is not wrapping this component.
          <p className="mt-2">Make sure App.tsx includes &lt;BusinessProvider&gt; around your routes.</p>
          <pre className="mt-2 text-sm">{error.toString()}</pre>
        </div>
      </div>
    );
  }

  const {
    business,
    loading: businessLoading,
    error: businessError,
    updateBusiness,
    updateOperatingHours,
    refreshBusiness
  } = businessContextResult;

  console.log('📊 BusinessProfile: Business context state:', {
    business: business ? {
      id: business.id,
      storeName: business.storeName,
      accountManager: business.accountManager
    } : null,
    businessLoading,
    businessError
  });

  const handleUpdateBusiness = async (businessData: Partial<Business>) => {
    console.log('📝 BusinessProfile: handleUpdateBusiness called with:', businessData);
    try {
      await updateBusiness(businessData);
      console.log('✅ BusinessProfile: Business update successful');
    } catch (error) {
      console.error('❌ BusinessProfile: Business update failed:', error);
    }
  };

  const handleUpdateOperatingHours = async (operatingHours: OperatingHours) => {
    console.log('⏰ BusinessProfile: handleUpdateOperatingHours called with:', operatingHours);
    try {
      await updateOperatingHours(operatingHours);
      console.log('✅ BusinessProfile: Operating hours update successful');
    } catch (error) {
      console.error('❌ BusinessProfile: Operating hours update failed:', error);
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 BusinessProfile: Refresh requested');
    try {
      await refreshBusiness();
      console.log('✅ BusinessProfile: Refresh successful');
    } catch (error) {
      console.error('❌ BusinessProfile: Refresh failed:', error);
    }
  };

  // Show loading state for user
  if (userLoading) {
    console.log('⏳ BusinessProfile: Waiting for user data...');
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <div className="ml-4 text-sm text-gray-500">
          Loading user data...
        </div>
      </div>
    );
  }

  // Check if user exists
  if (!user) {
    console.error('❌ BusinessProfile: No user found');
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Authentication Error:</strong> No user session found.
          <p className="mt-2">Please log in to access the business profile.</p>
        </div>
      </div>
    );
  }

  // Check if user has businessId
  if (!user.businessId) {
    console.error('❌ BusinessProfile: User has no businessId');
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Configuration Error:</strong> User account is not associated with a business.
          <p className="mt-2">User ID: {user.uid}</p>
          <p>Role: {user.role}</p>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Retry Loading Business
          </button>
        </div>
      </div>
    );
  }

  // Check for business context errors
  if (businessError) {
    console.error('❌ BusinessProfile: Business context error:', businessError);
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Perfil del Negocio</h1>
          <p className="text-gray-600">
            Administra la información y configuración de tu negocio
          </p>
        </div>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error Loading Business:</strong> {businessError}
          <div className="mt-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Perfil del Negocio</h1>
        <p className="text-gray-600">
          Administra la información y configuración de tu negocio
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Sesión iniciada como: {user.name || user.email} ({user.email})
        </div>
        <div className="mt-1 text-sm text-gray-500">
          Business ID: {user.businessId}
        </div>
      </div>

      {/* Debug Information Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>User State:</strong>
              <pre className="text-xs mt-1 overflow-auto">{JSON.stringify({
                uid: user.uid,
                email: user.email,
                role: user.role,
                businessId: user.businessId
              }, null, 2)}</pre>
            </div>
            <div>
              <strong>Business State:</strong>
              <pre className="text-xs mt-1 overflow-auto">{JSON.stringify({
                hasBusinessData: !!business,
                businessId: business?.id,
                storeName: business?.storeName,
                businessLoading,
                businessError
              }, null, 2)}</pre>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            🔄 Refresh Business Data
          </button>
        </div>
      )}
      
      {businessLoading && !business ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
          <div className="ml-4 text-sm text-gray-500">
            Loading business data for ID: {user.businessId}...
          </div>
        </div>
      ) : business ? (
        <BusinessProfileComponent
          business={business}
          onUpdateBusiness={handleUpdateBusiness}
          onUpdateOperatingHours={handleUpdateOperatingHours}
          loading={businessLoading}
          error={businessError}
        />
      ) : (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <strong>No Business Data:</strong> Business information is not available.
          <p className="mt-2">Business ID: {user.businessId}</p>
          <p className="text-sm mt-1">This might be because:</p>
          <ul className="text-sm mt-1 ml-4 list-disc">
            <li>The business document doesn't exist in Firestore</li>
            <li>There are permission issues accessing the business data</li>
            <li>The business ID in the user profile is incorrect</li>
          </ul>
          <button 
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            🔄 Retry Loading Business
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;