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
    <div className="card-base shadow-brand-lg">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
        
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-base p-6 bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sky-700 font-semibold mb-1">Clientes totales</p>
                <p className="text-2xl font-bold text-sky-800">{data.totalCustomers}</p>
              </div>
              <div className="p-3 bg-sky-100 rounded-full">
                <Users className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </div>
          
          <div className="card-base p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-semibold mb-1">Clientes nuevos</p>
                <p className="text-2xl font-bold text-emerald-800">{data.newCustomers}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <UserPlus className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="card-base p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold mb-1">Clientes recurrentes</p>
                <p className="text-2xl font-bold text-purple-800">{data.returningCustomers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="card-base p-6 bg-gradient-to-r from-saffron-50 to-amber-50 border-saffron-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-saffron-700 font-semibold mb-1">Pedidos por cliente</p>
                <p className="text-2xl font-bold text-saffron-800">{data.averageOrdersPerCustomer.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-saffron-100 rounded-full">
                <Star className="h-6 w-6 text-saffron-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Customers */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-4">Mejores clientes</h4>
          {data.topCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos</h3>
              <p className="text-gray-500">
                No se encontraron clientes para mostrar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.topCustomers.map((customer, index) => (
                <div key={customer.userId} className="card-interactive p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-white shadow-lg ${
                        index === 0 ? 'bg-gradient-to-r from-saffron-500 to-amber-500' :
                        index === 1 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                        index === 2 ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                        'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-bold text-gray-900">{customer.name}</h4>
                        <p className="text-sm text-gray-600 font-medium">
                          {customer.ordersCount} {customer.ordersCount === 1 ? 'pedido' : 'pedidos'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-saffron-600">{formatCurrency(customer.totalSpent)}</p>
                      <div className="flex items-center justify-end text-amber-500 mt-1">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-bold">
                          {customer.ordersCount > 0 ? 
                            `${formatCurrency(customer.totalSpent / customer.ordersCount).replace('$', '').replace(' MXN', '')}` : 
                            '0'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalyticsComponent;