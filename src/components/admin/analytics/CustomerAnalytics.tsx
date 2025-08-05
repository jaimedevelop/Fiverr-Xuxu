import React from 'react';
import { Users, UserPlus, TrendingUp, Star } from 'lucide-react';
import { CustomerAnalytics } from '../../../types/analytics';
import BaseCard from '../../../components/common/BaseCard';

interface CustomerAnalyticsProps {
  title: string;
  data: CustomerAnalytics;
  className?: string;
}

const CustomerAnalyticsComponent: React.FC<CustomerAnalyticsProps> = ({ 
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

  return (
    <BaseCard title={title} className={className}>
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes totales</p>
              <p className="text-lg font-bold">{data.totalCustomers}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes nuevos</p>
              <p className="text-lg font-bold">{data.newCustomers}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes recurrentes</p>
              <p className="text-lg font-bold">{data.returningCustomers}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pedidos por cliente</p>
              <p className="text-lg font-bold">{data.averageOrdersPerCustomer.toFixed(1)}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Customers */}
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-3">Mejores clientes</h3>
        {data.topCustomers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay datos</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron clientes para mostrar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.topCustomers.map((customer, index) => (
              <div key={customer.userId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{customer.name}</h4>
                    <p className="text-sm text-gray-500">{customer.ordersCount} pedidos</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                  <div className="flex items-center justify-end text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-xs font-medium">
                      {customer.ordersCount > 0 ? 
                        `${(customer.totalSpent / customer.ordersCount).toFixed(0)}` : 
                        '0'
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default CustomerAnalyticsComponent;