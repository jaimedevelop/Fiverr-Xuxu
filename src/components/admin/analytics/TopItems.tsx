// src/components/admin/analytics/TopItems.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Package, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { ItemPerformance } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';
import { getTopItemsData } from '../../../services/analytics/topItemsService';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { useUser } from '../../../contexts/UserContext';
import { getButtonClass } from '../../../utils/themeHelper';

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
      <div className="card-base shadow-brand-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Seleccionando rango de fechas...</p>
          </div>
        </div>
      </div>
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
      <div className="card-base shadow-brand-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Check if the error is related to missing businessId
    const isMissingBusinessError = error.includes('No se encontró el ID del negocio');
    
    return (
      <div className="card-base shadow-brand-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex items-center text-red-500 mb-6">
              <AlertCircle className="h-6 w-6 mr-3" />
              <p className="font-semibold">{error}</p>
            </div>
            
            {isMissingBusinessError && (
              <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-6 mb-6 max-w-md">
                <div className="flex">
                  <Info className="h-5 w-5 text-sky-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-sky-800">
                    <p className="font-bold mb-2">Información importante</p>
                    <p className="mb-3">Esta cuenta de usuario no está asociada a un negocio. Para ver las analíticas, necesitas:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Iniciar sesión con una cuenta de negocio</li>
                      <li>O asociar esta cuenta a un negocio existente</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleRetry}
              className={`${getButtonClass('admin')} flex items-center gap-2`}
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base shadow-brand-lg">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos</h3>
            <p className="text-gray-500">
              No se encontraron productos para mostrar en el período seleccionado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.slice(0, 10).map((item, index) => (
              <div key={item.pastryId} className="card-interactive p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-white shadow-lg ${
                      index === 0 ? 'bg-gradient-to-r from-saffron-500 to-amber-500' :
                      index === 1 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                      index === 2 ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-purple-600 font-semibold">{item.categoryName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-saffron-600">{formatCurrency(item.revenue)}</p>
                      <p className="text-sm text-gray-600 font-medium">{item.ordersCount} {item.ordersCount === 1 ? 'pedido' : 'pedidos'}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-3 mr-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${item.popularityScore}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-bold">{item.popularityScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopItems;