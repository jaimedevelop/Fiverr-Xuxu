// src/components/admin/analytics/SalesChart.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, RefreshCw, AlertCircle, Info, BarChart3 } from 'lucide-react';
import { SalesDataPoint, SalesComparison } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';
import { getSalesData } from '../../../services/analytics/salesDataService';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
import { useUser } from '../../../contexts/UserContext';
import { getButtonClass } from '../../../utils/themeHelper';

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
      <div className="card-base shadow-brand-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Cargando rango de fechas...</p>
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
      <div className="card-base shadow-brand-lg">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando datos de ventas...</p>
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
      <div className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  // Render summary metrics
  const renderSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-sm text-emerald-700 font-semibold mb-1">Pedidos totales</p>
            <p className="text-2xl font-bold text-emerald-800">{totalOrders}</p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-full">
            <ShoppingCart className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>
      
      <div className="card-base p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-700 font-semibold mb-1">Valor promedio</p>
            <p className="text-2xl font-bold text-purple-800">{formatCurrency(averageOrderValue)}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card-base shadow-brand-lg">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
        
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos</h3>
            <p className="text-gray-500">
              No se encontraron datos de ventas para mostrar en el período seleccionado.
            </p>
          </div>
        ) : (
          <>
            {renderSummary()}
            
            <div className="space-y-8">
              {/* Revenue Chart */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-saffron-600" />
                  Ingresos por día
                </h4>
                <div className="space-y-3">
                  {data.map((point, index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <div className="w-20 text-sm text-gray-600 font-medium">
                        {formatDate(point.date)}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-saffron-500 to-amber-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(point.revenue / maxRevenue) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-28 text-right text-sm font-bold text-saffron-600 ml-4">
                        {formatCurrency(point.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Orders Chart */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  Pedidos por día
                </h4>
                <div className="space-y-3">
                  {data.map((point, index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                      <div className="w-20 text-sm text-gray-600 font-medium">
                        {formatDate(point.date)}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(point.orders / maxOrders) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-28 text-right text-sm font-bold text-emerald-600 ml-4">
                        {point.orders} {point.orders === 1 ? 'pedido' : 'pedidos'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesChart;