import React from 'react';
import { TrendingUp, Star, Package } from 'lucide-react';
import { ItemPerformance } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';

interface TopItemsProps {
  title: string;
  items: ItemPerformance[];
  className?: string;
}

const TopItems: React.FC<TopItemsProps> = ({ title, items, className = '' }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  // Sort items by revenue (descending)
  const sortedItems = [...items].sort((a, b) => b.revenue - a.revenue);

  return (
    <BaseCard title={title} className={className}>
      {sortedItems.length === 0 ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron items para mostrar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedItems.slice(0, 10).map((item, index) => (
            <div key={item.pastryId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                  {index + 1}
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.categoryName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</p>
                  <p className="text-xs text-gray-500">{item.ordersCount} pedidos</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.popularityScore}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-xs font-medium">{item.popularityScore}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseCard>
  );
};

export default TopItems;