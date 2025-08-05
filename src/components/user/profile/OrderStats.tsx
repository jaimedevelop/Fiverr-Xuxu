import React from 'react';

interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  favoriteCategory: string;
  lastOrderDate?: Date;
  mostOrderedItem?: string;
}

interface OrderStatsProps {
  stats: OrderStats;
  loading?: boolean;
}

export const OrderStats: React.FC<OrderStatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de pedidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas de pedidos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Total de pedidos</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Total gastado</p>
          <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Promedio por pedido</p>
          <p className="text-2xl font-bold text-gray-900">${stats.averageOrderValue.toFixed(2)}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600">Categoría favorita</p>
          <p className="text-lg font-bold text-gray-900">{stats.favoriteCategory}</p>
        </div>
      </div>

      {(stats.lastOrderDate || stats.mostOrderedItem) && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.lastOrderDate && (
              <div>
                <p className="text-sm font-medium text-gray-600">Último pedido</p>
                <p className="text-sm text-gray-900">
                  {stats.lastOrderDate.toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}
            
            {stats.mostOrderedItem && (
              <div>
                <p className="text-sm font-medium text-gray-600">Artículo más pedido</p>
                <p className="text-sm text-gray-900">{stats.mostOrderedItem}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};