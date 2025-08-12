// src/pages/admin/BusinessProfile.tsx - Compatible with your existing BusinessContext
import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { useUser } from '../../contexts/UserContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FormError from '../../components/common/FormError';
import BusinessProfileComponent from '../../components/admin/business/BusinessProfile';
import { Business, OperatingHours } from '../../types/business';
import { Building2, RefreshCw, AlertTriangle, Users, Settings, Shield } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-800">Error de Contexto</h2>
                <p className="text-red-600">BusinessProvider no está envolviendo este componente.</p>
              </div>
            </div>
            <div className="bg-red-100 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700 mb-2">
                Asegúrate de que App.tsx incluya &lt;BusinessProvider&gt; alrededor de tus rutas.
              </p>
              <pre className="text-xs text-red-600 bg-red-200 p-2 rounded overflow-auto">
                {error.toString()}
              </pre>
            </div>
          </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando datos de usuario...</p>
        </div>
      </div>
    );
  }

  // Check if user exists
  if (!user) {
    console.error('❌ BusinessProfile: No user found');
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
            <div className="text-center">
              <Shield className="mx-auto h-16 w-16 text-red-500 mb-6" />
              <h2 className="text-xl font-semibold text-red-800 mb-3">Error de Autenticación</h2>
              <p className="text-red-600 mb-6">No se encontró una sesión de usuario activa.</p>
              <p className="text-red-500 text-sm">Por favor, inicia sesión para acceder al perfil del negocio.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has businessId
  if (!user.businessId) {
    console.error('❌ BusinessProfile: User has no businessId');
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 shadow-sm">
            <div className="text-center">
              <Users className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">Error de Configuración</h2>
              <p className="text-yellow-700 mb-6">La cuenta de usuario no está asociada a un negocio.</p>
              <div className="bg-yellow-100 rounded-lg p-4 mb-6 text-sm text-yellow-700">
                <p><span className="font-medium">User ID:</span> {user.uid}</p>
                <p><span className="font-medium">Rol:</span> {user.role}</p>
              </div>
              <button 
                onClick={handleRefresh}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={18} />
                Reintentar Cargar Negocio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check for business context errors
  if (businessError) {
    console.error('❌ BusinessProfile: Business context error:', businessError);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Perfil del Negocio
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Administra la información y configuración de tu negocio
                  </p>
                </div>
              </div>
            </div>
            
            {/* Error Section */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-red-800">Error al Cargar Negocio</h2>
                  <p className="text-red-600">{businessError}</p>
                </div>
              </div>
              <button 
                onClick={handleRefresh}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Intentar Nuevamente
              </button>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Perfil del Negocio
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Administra la información y configuración de tu negocio
                  </p>
                </div>
              </div>
              <div className="hidden sm:block">
                <button 
                  onClick={handleRefresh}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Business Profile Content */}
          {businessLoading && !business ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6"></div>
                <p className="text-gray-600 font-medium mb-2">Cargando información del negocio...</p>
                <p className="text-sm text-gray-500">Business ID: {user.businessId}</p>
              </div>
            </div>
          ) : business ? (
            <div className="space-y-8">
              

              {/* Business Profile Component */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <BusinessProfileComponent
                  business={business}
                  onUpdateBusiness={handleUpdateBusiness}
                  onUpdateOperatingHours={handleUpdateOperatingHours}
                  loading={businessLoading}
                  error={businessError}
                />
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 shadow-sm">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
                <h2 className="text-xl font-semibold text-yellow-800 mb-3">
                  Datos del Negocio No Disponibles
                </h2>
                <p className="text-yellow-700 mb-6">
                  La información del negocio no está disponible en este momento.
                </p>
                
                <div className="bg-yellow-100 rounded-lg p-4 mb-6 text-sm text-yellow-700">
                  <p className="font-medium mb-2">Business ID: {user.businessId}</p>
                  <p className="mb-2">Esto podría deberse a:</p>
                  <ul className="text-left space-y-1 max-w-md mx-auto">
                    <li>• El documento del negocio no existe en Firestore</li>
                    <li>• Problemas de permisos para acceder a los datos</li>
                    <li>• El ID del negocio en el perfil de usuario es incorrecto</li>
                  </ul>
                </div>
                
                <button 
                  onClick={handleRefresh}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={18} />
                  Reintentar Cargar Negocio
                </button>
              </div>
            </div>
          )}

        

        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;