// src/components/admin/analytics/CategoryPerformance.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { CategoryPerformance } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';
import { getCategoryPerformanceData } from '../../../services/analytics/categoryPerformanceService';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { useUser } from '../../../contexts/UserContext';

interface CategoryPerformanceProps {
  title: string;
  timeRange: { start: Date; end: Date };
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
      <BaseCard title={title} className={className}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando datos de categorías...</p>
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

  // Calculate total revenue for percentage calculations
  const totalRevenue = data.reduce((sum, category) => sum + category.revenue, 0);
  
  // Sort by revenue (descending)
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <BaseCard title={title} className={className}>
      {data.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron categorías para mostrar en el período seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos totales</p>
                  <p className="text-lg font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorías</p>
                  <p className="text-lg font-bold">{data.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Category List */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Rendimiento por categoría</h3>
            <div className="space-y-4">
              {sortedData.map((category, index) => (
                <div key={category.categoryId} className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <h4 className="text-sm font-medium text-gray-900">{category.categoryName}</h4>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(category.revenue)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${category.percentageOfTotal}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      {category.percentageOfTotal.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {category.ordersCount} pedidos
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </BaseCard>
  );
};

export default CategoryPerformanceComponent;