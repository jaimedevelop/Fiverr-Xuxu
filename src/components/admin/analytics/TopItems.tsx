// src/components/admin/analytics/TopItems.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Package, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { ItemPerformance } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';
import { getTopItemsData } from '../../../services/analytics/topItemsService';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { useUser } from '../../../contexts/UserContext';

interface TopItemsProps {
  title: string;
  timeRange: { start: Date; end: Date };
  className?: string;
}

const TopItems: React.FC<TopItemsProps> = ({ title, timeRange, className = '' }) => {
  const [items, setItems] = useState<ItemPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const { business } = useBusiness();
  const { user } = useUser();

  // Add detailed debugging for auth, user, and business state
  console.log('Auth, User, and Business state:', {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    authUser: authState.user ? `Auth user with ID: ${authState.user.id}` : 'No auth user',
    user: user ? `User with ID: ${user.uid}, role: ${user.role}` : 'No user',
    businessId: user?.businessId || 'No businessId in user',
    business: business ? `Business with ID: ${business.id}` : 'No business',
  });

  // Add a guard to ensure timeRange is defined
  if (!timeRange || !timeRange.start || !timeRange.end) {
    console.log('timeRange is undefined or incomplete');
    return (
      <BaseCard title={title} className={className}>
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Seleccionando rango de fechas...</p>
        </div>
      </BaseCard>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const fetchItems = async () => {
    console.log('fetchItems function called');
    
    // Try to get businessId from either the user object or the business object
    const businessId = user?.businessId || business?.id;
    
    if (!businessId) {
      console.log('No businessId found in user or business object');
      setError('No se encontró el ID del negocio. Por favor, inicia sesión con una cuenta de negocio.');
      setLoading(false);
      return;
    }
    
    console.log('Fetching items for business:', businessId);
    setLoading(true);
    setError(null);
    
    try {
      console.log('Calling getTopItemsData with:', {
        businessId,
        startDate: timeRange.start.toISOString(),
        endDate: timeRange.end.toISOString()
      });
      
      const data = await getTopItemsData(businessId, timeRange.start, timeRange.end);
      console.log('Received data from service:', data);
      
      setItems(data);
    } catch (err) {
      console.error('Error in fetchItems:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      console.log('fetchItems completed, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have a businessId from either source
    const businessId = user?.businessId || business?.id;
    
    if (businessId) {
      fetchItems();
    } else if (!authState.isLoading && user) {
      // If auth is not loading and we have a user but no businessId, set error
      setError('No se encontró el ID del negocio. Por favor, inicia sesión con una cuenta de negocio.');
      setLoading(false);
    }
  }, [user?.businessId, business?.id, timeRange, authState.isLoading, user]);

  // Add a retry button
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchItems();
  };

  console.log('TopItems state:', { 
    loading, 
    error, 
    itemsCount: items.length,
    items: items.slice(0, 3) // Log first 3 items to see structure
  });

  if (loading) {
    return (
      <BaseCard title={title} className={className}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando datos...</p>
        </div>
      </BaseCard>
    );
  }

  if (error) {
    // Check if the error is related to missing businessId
    const isMissingBusinessError = error.includes('No se encontró el ID del negocio');
    
    return (
      <BaseCard title={title} className={className}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex items-center text-red-500 mb-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
          
          {isMissingBusinessError && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-md">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Información importante</p>
                  <p>Esta cuenta de usuario no está asociada a un negocio. Para ver las analíticas, necesitas:</p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Iniciar sesión con una cuenta de negocio</li>
                    <li>O asociar esta cuenta a un negocio existente</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleRetry}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </button>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard title={title} className={className}>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron productos para mostrar en el período seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.slice(0, 10).map((item, index) => (
            <div key={item.pastryId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                  {index + 1}
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.categoryName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</p>
                  <p className="text-xs text-gray-500">{item.ordersCount} pedidos</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.popularityScore}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-xs font-medium">{item.popularityScore}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseCard>
  );
};

export default TopItems;