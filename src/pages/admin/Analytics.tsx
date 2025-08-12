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

  const mockTopItems = [
    {
      pastryId: '1',
      name: 'Croissant de Chocolate',
      categoryId: '1',
      categoryName: 'Panadería',
      ordersCount: 45,
      totalQuantity: 68,
      revenue: 1125,
      popularityScore: 95
    },
    {
      pastryId: '2',
      name: 'Concha',
      categoryId: '1',
      categoryName: 'Panadería',
      ordersCount: 38,
      totalQuantity: 57,
      revenue: 855,
      popularityScore: 88
    },
    {
      pastryId: '3',
      name: 'Pastel de Chocolate',
      categoryId: '2',
      categoryName: 'Repostería',
      ordersCount: 22,
      totalQuantity: 24,
      revenue: 1540,
      popularityScore: 76
    },
    {
      pastryId: '4',
      name: 'Donut',
      categoryId: '1',
      categoryName: 'Panadería',
      ordersCount: 31,
      totalQuantity: 62,
      revenue: 775,
      popularityScore: 82
    },
    {
      pastryId: '5',
      name: 'Pastel de Fresa',
      categoryId: '3',
      categoryName: 'Dulces',
      ordersCount: 27,
      totalQuantity: 54,
      revenue: 1350,
      popularityScore: 79
    }
  ];

  const mockCustomerAnalytics = {
    totalCustomers: 128,
    newCustomers: 24,
    returningCustomers: 104,
    averageOrdersPerCustomer: 2.7,
    topCustomers: [
      {
        userId: '1',
        name: 'Juan Pérez',
        ordersCount: 8,
        totalSpent: 2150
      },
      {
        userId: '2',
        name: 'María García',
        ordersCount: 6,
        totalSpent: 1870
      },
      {
        userId: '3',
        name: 'Carlos López',
        ordersCount: 5,
        totalSpent: 1620
      },
      {
        userId: '4',
        name: 'Ana Martínez',
        ordersCount: 7,
        totalSpent: 1540
      },
      {
        userId: '5',
        name: 'Roberto Sánchez',
        ordersCount: 4,
        totalSpent: 1320
      }
    ]
  };

  const mockCategoryPerformance = [
    {
      categoryId: '1',
      categoryName: 'Panadería',
      ordersCount: 142,
      revenue: 4250,
      percentageOfTotal: 48.3
    },
    {
      categoryId: '2',
      categoryName: 'Repostería',
      ordersCount: 87,
      revenue: 3120,
      percentageOfTotal: 35.5
    },
    {
      categoryId: '3',
      categoryName: 'Salados',
      ordersCount: 56,
      revenue: 1420,
      percentageOfTotal: 16.2
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando analíticas...</p>
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
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Analíticas
                </h1>
                <p className="text-lg text-gray-600">
                  Mide y analiza el rendimiento de tu negocio con datos en tiempo real
                </p>
              </div>
              
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <FormError message={error} />
            </div>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-gray-900">$21,950</p>
                  <p className="text-xs text-green-600 mt-1">+12.5% vs período anterior</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Pedidos</p>
                  <p className="text-3xl font-bold text-gray-900">123</p>
                  <p className="text-xs text-green-600 mt-1">+8.3% vs período anterior</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Clientes</p>
                  <p className="text-3xl font-bold text-gray-900">128</p>
                  <p className="text-xs text-blue-600 mt-1">24 clientes nuevos</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Valor Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">$178.45</p>
                  <p className="text-xs text-orange-600 mt-1">+5.2% vs período anterior</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Sales Chart Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Tendencia de Ventas
              </h2>
              <p className="text-gray-600">
                Evolución de ingresos y pedidos a lo largo del tiempo
              </p>
            </div>
            
            <SalesChart
              title="Ventas"
              data={salesData || mockSalesData}
              comparison={salesComparison}
            />
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Productos Más Vendidos
                </h2>
                <p className="text-gray-600">
                  Los productos con mejor rendimiento en el período seleccionado
                </p>
              </div>
              
              <TopItems
                title="Productos más vendidos"
                items={topItems || mockTopItems}
              />
            </div>

            {/* Customer Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Analítica de Clientes
                </h2>
                <p className="text-gray-600">
                  Insights sobre el comportamiento y preferencias de tus clientes
                </p>
              </div>
              
              <CustomerAnalyticsComponent
                title="Analítica de clientes"
                data={customerAnalytics || mockCustomerAnalytics}
              />
            </div>
          </div>

          {/* Category Performance Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Rendimiento por Categoría
              </h2>
              <p className="text-gray-600">
                Análisis del desempeño de ventas por cada categoría de productos
              </p>
            </div>
            
            <CategoryPerformanceComponent
              title="Rendimiento por categoría"
              data={categoryPerformance || mockCategoryPerformance}
            />
          </div>

          {/* Insights & Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Insights y Recomendaciones
              </h2>
              <p className="text-gray-600">
                Sugerencias basadas en el análisis de tus datos de ventas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-blue-800">Tendencia Positiva</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Tus ventas han aumentado un 12.5% comparado con el período anterior. 
                  Los croissants de chocolate son tu producto estrella.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-green-800">Crecimiento de Clientes</h3>
                </div>
                <p className="text-sm text-green-700">
                  Has ganado 24 nuevos clientes en este período. Considera implementar 
                  un programa de fidelización para retenerlos.
                </p>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-amber-800">Oportunidad de Mejora</h3>
                </div>
                <p className="text-sm text-amber-700">
                  La categoría "Salados" tiene el menor rendimiento. Considera 
                  promociones especiales o revisar tu oferta de productos salados.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="text-sm font-medium text-blue-800 mb-1">Exportar Reporte</h4>
                <p className="text-xs text-blue-600">Descargar análisis completo</p>
              </button>
              
              <button className="bg-green-50 hover:bg-green-100 border border-green-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                <h4 className="text-sm font-medium text-green-800 mb-1">Comparar Períodos</h4>
                <p className="text-xs text-green-600">Analizar tendencias históricas</p>
              </button>
              
              <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="text-sm font-medium text-purple-800 mb-1">Segmentar Clientes</h4>
                <p className="text-xs text-purple-600">Análisis detallado de clientes</p>
              </button>
              
              <button className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 p-4 rounded-lg transition-colors duration-200 text-left">
                <Package className="w-6 h-6 text-yellow-600 mb-2" />
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Optimizar Inventario</h4>
                <p className="text-xs text-yellow-600">Recomendaciones de stock</p>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;