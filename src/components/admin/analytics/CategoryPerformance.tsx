// src/components/admin/analytics/CategoryPerformance.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, RefreshCw, AlertCircle, Info, Package } from 'lucide-react';
import { CategoryPerformance } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';
import { getCategoryPerformanceData } from '../../../services/analytics/categoryPerformanceService';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { useUser } from '../../../contexts/UserContext';
import { getButtonClass } from '../../../utils/themeHelper';

interface CategoryPerformanceProps {
  title: string;
  timeRange: { start: Date; end: Date };
  className?: string;
}

const COLORS = ['#8b5cf6', '#F5CB5C', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];

const CategoryPerformanceComponent: React.FC<CategoryPerformanceProps> = ({ 
  title, 
  timeRange, 
  className = '' 
}) => {
  const [data, setData] = useState<CategoryPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const { business } = useBusiness();
  const { user } = useUser();

  // Add detailed debugging for auth, user, and business state
  console.log('CategoryPerformance - Auth, User, and Business state:', {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    authUser: authState.user ? `Auth user with ID: ${authState.user.id}` : 'No auth user',
    user: user ? `User with ID: ${user.uid}, role: ${user.role}` : 'No user',
    businessId: user?.businessId || 'No businessId in user',
    business: business ? `Business with ID: ${business.id}` : 'No business',
  });

  // Add a guard to ensure timeRange is defined
  if (!timeRange || !timeRange.start || !timeRange.end) {
    console.log('CategoryPerformance - timeRange is undefined or incomplete');
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

  const fetchCategoryData = async () => {
    console.log('CategoryPerformance - fetchCategoryData function called');
    
    // Try to get businessId from either the user object or the business object
    const businessId = user?.businessId || business?.id;
    
    if (!businessId) {
      console.log('CategoryPerformance - No businessId found in user or business object');
      setError('No se encontró el ID del negocio. Por favor, inicia sesión con una cuenta de negocio.');
      setLoading(false);
      return;
    }
    
    console.log('CategoryPerformance - Fetching data for business:', businessId);
    setLoading(true);
    setError(null);
    
    try {
      console.log('CategoryPerformance - Calling getCategoryPerformanceData with:', {
        businessId,
        startDate: timeRange.start.toISOString(),
        endDate: timeRange.end.toISOString()
      });
      
      const categoryData = await getCategoryPerformanceData(businessId, timeRange.start, timeRange.end);
      console.log('CategoryPerformance - Received data from service:', categoryData);
      
      setData(categoryData);
    } catch (err) {
      console.error('CategoryPerformance - Error in fetchCategoryData:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos de categorías');
    } finally {
      console.log('CategoryPerformance - fetchCategoryData completed, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have a businessId from either source
    const businessId = user?.businessId || business?.id;
    
    if (businessId) {
      fetchCategoryData();
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
    fetchCategoryData();
  };

  console.log('CategoryPerformance state:', { 
    loading, 
    error, 
    dataCount: data.length,
    data: data.slice(0, 2) // Log first 2 items to see structure
  });

  if (loading) {
    return (
      <div className="card-base shadow-brand-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando datos de categorías...</p>
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

  // Calculate total revenue for percentage calculations
  const totalRevenue = data.reduce((sum, category) => sum + category.revenue, 0);
  
  // Sort by revenue (descending)
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="card-base shadow-brand-lg">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
        
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos</h3>
            <p className="text-gray-500">
              No se encontraron categorías para mostrar en el período seleccionado.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-base p-6 bg-gradient-to-r from-saffron-50 to-amber-50 border-saffron-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-saffron-700 font-semibold mb-1">Ingresos totales</p>
                    <p className="text-2xl font-bold text-saffron-800">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-saffron-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-saffron-600" />
                  </div>
                </div>
              </div>
              
              <div className="card-base p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700 font-semibold mb-1">Categorías activas</p>
                    <p className="text-2xl font-bold text-emerald-800">{data.length}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category List */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Rendimiento por categoría</h4>
              <div className="space-y-4">
                {sortedData.map((category, index) => (
                  <div key={category.categoryId} className="card-base p-5 hover:shadow-brand-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-4 shadow-sm" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <h4 className="text-base font-bold text-gray-900">{category.categoryName}</h4>
                      </div>
                      <div className="text-lg font-bold text-saffron-600">
                        {formatCurrency(category.revenue)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-3 mr-4">
                        <div 
                          className="h-3 rounded-full transition-all duration-500 ease-out" 
                          style={{ 
                            width: `${category.percentageOfTotal}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                      <div className="text-sm font-bold text-purple-600 min-w-16 text-right">
                        {category.percentageOfTotal.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 font-medium">
                      {category.ordersCount} {category.ordersCount === 1 ? 'pedido' : 'pedidos'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPerformanceComponent;