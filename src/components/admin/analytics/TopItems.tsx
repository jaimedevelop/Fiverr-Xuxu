// src/components/admin/analytics/TopItems.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Package } from 'lucide-react';
import { ItemPerformance } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';
import { getTopItemsData } from '../../../services/analytics/topItemsService';
import { useAuth } from '../../../contexts/AuthContext';

interface TopItemsProps {
  title: string;
  timeRange: { start: Date; end: Date };
  className?: string;
}

const TopItems: React.FC<TopItemsProps> = ({ title, timeRange, className = '' }) => {
  const [items, setItems] = useState<ItemPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const user = authState.user;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (!user?.businessId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTopItemsData(user.businessId, timeRange.start, timeRange.end);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user?.businessId, timeRange]);

  if (loading) {
    return (
      <BaseCard title={title} className={className}>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </BaseCard>
    );
  }

  if (error) {
    return (
      <BaseCard title={title} className={className}>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard title={title} className={className}>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron productos para mostrar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.slice(0, 10).map((item, index) => (
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