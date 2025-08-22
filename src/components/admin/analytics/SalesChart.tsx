// src/components/admin/analytics/SalesChart.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { SalesDataPoint, SalesComparison } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';
import { getSalesData } from '../../../services/analytics/salesDataService';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { useUser } from '../../../contexts/UserContext';

interface SalesChartProps {
  title: string;
  timeRange: { start: Date; end: Date };
  className?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ 
  title, 
  timeRange, 
  className = '' 
}) => {
  const [data, setData] = useState<SalesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const { business } = useBusiness();
  const { user } = useUser();

  // Add detailed debugging for auth, user, and business state
  console.log('SalesChart - Auth, User, and Business state:', {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    authUser: authState.user ? `Auth user with ID: ${authState.user.id}` : 'No auth user',
    user: user ? `User with ID: ${user.uid}, role: ${user.role}` : 'No user',
    businessId: user?.businessId || 'No businessId in user',
    business: business ? `Business with ID: ${business.id}` : 'No business',
  });

  // Add a guard to ensure timeRange is defined
  if (!timeRange || !timeRange.start || !timeRange.end) {
    console.log('SalesChart - timeRange is undefined or incomplete');
    return (
      <BaseCard title={title} className={className}>
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Cargando rango de fechas...</p>
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const fetchSalesData = async () => {
    console.log('SalesChart - fetchSalesData function called');
    
    // Try to get businessId from either the user object or the business object
    const businessId = user?.businessId || business?.id;
    
    if (!businessId) {
      console.log('SalesChart - No businessId found in user or business object');
      setError('No se encontró el ID del negocio. Por favor, inicia sesión con una cuenta de negocio.');
      setLoading(false);
      return;
    }
    
    console.log('SalesChart - Fetching data for business:', businessId);
    setLoading(true);
    setError(null);
    
    try {
      console.log('SalesChart - Calling getSalesData with:', {
        businessId,
        startDate: timeRange.start.toISOString(),
        endDate: timeRange.end.toISOString()
      });
      
      const salesData = await getSalesData(businessId, timeRange.start, timeRange.end);
      console.log('SalesChart - Received data from service:', salesData);
      
      setData(salesData);
    } catch (err) {
      console.error('SalesChart - Error in fetchSalesData:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos de ventas');
    } finally {
      console.log('SalesChart - fetchSalesData completed, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have a businessId from either source
    const businessId = user?.businessId || business?.id;
    
    if (businessId) {
      fetchSalesData();
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
    fetchSalesData();
  };

  console.log('SalesChart state:', { 
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
          <p className="mt-2 text-gray-600">Cargando datos de ventas...</p>
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

  // Calculate summary metrics
  const totalRevenue = data.reduce((sum, point) => sum + point.revenue, 0);
  const totalOrders = data.reduce((sum, point) => sum + point.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Find max values for scaling
  const maxRevenue = Math.max(...data.map(point => point.revenue), 1);
  const maxOrders = Math.max(...data.map(point => point.orders), 1);

  // Format change indicator
  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  // Render summary metrics
  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <p className="text-sm text-gray-600">Pedidos totales</p>
            <p className="text-lg font-bold">{totalOrders}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <ShoppingCart className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Valor promedio</p>
            <p className="text-lg font-bold">{formatCurrency(averageOrderValue)}</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-full">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );

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
            No se encontraron datos de ventas para mostrar en el período seleccionado.
          </p>
        </div>
      ) : (
        <>
          {renderSummary()}
          
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Ingresos</h3>
              <div className="space-y-2">
                {data.map((point, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-20 text-sm text-gray-600">
                      {formatDate(point.date)}
                    </div>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(point.revenue / maxRevenue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-24 text-right text-sm font-medium">
                      {formatCurrency(point.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Orders Chart */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Pedidos</h3>
              <div className="space-y-2">
                {data.map((point, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-20 text-sm text-gray-600">
                      {formatDate(point.date)}
                    </div>
                    <div className="flex-1 ml-2">
                      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(point.orders / maxOrders) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-24 text-right text-sm font-medium">
                      {point.orders}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </BaseCard>
  );
};

export default SalesChart;