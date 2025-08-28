import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package, Calendar, DollarSign } from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { TimeRange } from '../../types/analytics';
import TimeRangeSelector from '../../components/admin/analytics/TimeRangeSelector';
import SalesChart from '../../components/admin/analytics/SalesChart';
import TopItems from '../../components/admin/analytics/TopItems';
import CustomerAnalyticsComponent from '../../components/admin/analytics/CustomerAnalytics';
import CategoryPerformanceComponent from '../../components/admin/analytics/CategoryPerformance';
import BaseCard from '../../components/common/BaseCard';
import FormError from '../../components/common/FormError';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getButtonClass, colors } from '../../utils/themeHelper';

const Analytics: React.FC = () => {
  const {
    salesData,
    salesComparison,
    topItems,
    customerAnalytics,
    categoryPerformance,
    loading,
    error,
    fetchAnalytics
  } = useAnalytics();

  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange & { label?: string }>({
    start: new Date(),
    end: new Date(),
    label: 'today'
  });

  useEffect(() => {
    fetchAnalytics(selectedTimeRange);
  }, [selectedTimeRange]);

  const handleTimeRangeChange = (range: TimeRange & { label?: string }) => {
    setSelectedTimeRange(range);
  };

  // Mock data for development
  const mockSalesData = [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), orders: 12, revenue: 2450 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), orders: 15, revenue: 3120 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), orders: 8, revenue: 1870 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), orders: 18, revenue: 3890 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), orders: 14, revenue: 2760 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), orders: 20, revenue: 4320 },
    { date: new Date(), orders: 16, revenue: 3540 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 font-medium">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  const timeRangeForTopItems = {
    start: selectedTimeRange?.start || new Date(),
    end: selectedTimeRange?.end || new Date()
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="card-base p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-3">
                Analíticas
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Mide y analiza el rendimiento de tu negocio con datos en tiempo real
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Período seleccionado:</span>
                </div>
                <TimeRangeSelector
                  selectedRange={selectedTimeRange}
                  onChange={handleTimeRangeChange}
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="card-base p-6 border border-red-200 bg-red-50">
              <FormError message={error} />
            </div>
          )}

          {/* Sales Chart Section */}
          <div className="card-base p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Tendencia de Ventas
              </h2>
              <p className="text-gray-600">
                Evolución de ingresos y pedidos a lo largo del tiempo
              </p>
            </div>
          
            <SalesChart
              title="Ventas"
              timeRange={{ start: selectedTimeRange.start, end: selectedTimeRange.end }}
            />
          </div>

          {/* Top Items Section - Now full width */}
          <div className="card-base p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Productos Más Vendidos
              </h2>
              <p className="text-gray-600">
                Los productos con mejor rendimiento en el período seleccionado
              </p>
            </div>
            
            <TopItems
              title="Productos más vendidos"
              timeRange={timeRangeForTopItems}
            />
          </div>

          {/* Category Performance Section */}
          <div className="card-base p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Rendimiento por Categoría
              </h2>
              <p className="text-gray-600">
                Análisis del desempeño de ventas por cada categoría de productos
              </p>
            </div>
          
            <CategoryPerformanceComponent
              title="Rendimiento por categoría"
              timeRange={{ start: selectedTimeRange.start, end: selectedTimeRange.end }}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;