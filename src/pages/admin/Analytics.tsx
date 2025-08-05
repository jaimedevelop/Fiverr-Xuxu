import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';
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
      name: 'Empanada de Pollo',
      categoryId: '3',
      categoryName: 'Salados',
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

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analíticas</h1>
          <p className="text-gray-600">Mide y analiza el rendimiento de tu negocio</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <TimeRangeSelector
            selectedRange={selectedTimeRange}
            onChange={handleTimeRangeChange}
          />
        </div>
      </div>

      {error && <div className="mb-6"><FormError message={error} /></div>}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos totales</p>
              <p className="text-2xl font-bold text-gray-900">$21,950</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">123</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
            </div>
          </div>
        </BaseCard>
        
        <BaseCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Valor promedio</p>
              <p className="text-2xl font-bold text-gray-900">$178.45</p>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Sales Chart */}
      <div className="mb-6">
        <SalesChart
          title="Ventas"
          data={salesData || mockSalesData}
          comparison={salesComparison}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Items */}
        <TopItems
          title="Productos más vendidos"
          items={topItems || mockTopItems}
        />

        {/* Customer Analytics */}
        <CustomerAnalyticsComponent
          title="Analítica de clientes"
          data={customerAnalytics || mockCustomerAnalytics}
        />
      </div>

      {/* Category Performance */}
      <div className="mb-6">
        <CategoryPerformanceComponent
          title="Rendimiento por categoría"
          data={categoryPerformance || mockCategoryPerformance}
        />
      </div>
    </div>
  );
};

export default Analytics;