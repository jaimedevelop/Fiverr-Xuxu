import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';
import { SalesDataPoint, SalesComparison } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';

interface SalesChartProps {
  title: string;
  data: SalesDataPoint[];
  comparison?: SalesComparison;
  className?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ 
  title, 
  data, 
  comparison, 
  className = '' 
}) => {
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

  // Render comparison metrics
  const renderComparison = () => {
    if (!comparison) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos</p>
              <p className="text-lg font-bold">{formatCurrency(comparison.currentPeriod.revenue)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            {formatChange(comparison.revenueChange)}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos</p>
              <p className="text-lg font-bold">{comparison.currentPeriod.orders}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            {formatChange(comparison.ordersChange)}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor promedio</p>
              <p className="text-lg font-bold">{formatCurrency(comparison.currentPeriod.averageOrderValue)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            {formatChange(comparison.aovChange)}
          </div>
        </div>
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
      {comparison ? renderComparison() : renderSummary()}
      
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
    </BaseCard>
  );
};

export default SalesChart;