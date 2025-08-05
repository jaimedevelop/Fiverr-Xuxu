import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { CategoryPerformance } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';

interface CategoryPerformanceProps {
  title: string;
  data: CategoryPerformance[];
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CategoryPerformanceComponent: React.FC<CategoryPerformanceProps> = ({ 
  title, 
  data, 
  className = '' 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Sort by revenue (descending)
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  // Calculate total revenue for percentage calculations
  const totalRevenue = data.reduce((sum, category) => sum + category.revenue, 0);

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
            No se encontraron categorías para mostrar.
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