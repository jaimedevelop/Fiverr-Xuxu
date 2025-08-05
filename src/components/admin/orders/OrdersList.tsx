import React from 'react';
import { Eye, MoreVertical, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../../../types/order';
import Button from '../../../components/ui/Button';
import DataTable from '../../../components/common/DataTable';

interface OrdersListProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  loading?: boolean;
}

const OrdersList: React.FC<OrdersListProps> = ({ 
  orders, 
  onViewDetails, 
  onUpdateStatus, 
  loading = false 
}) => {
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
      case 'preparing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delivered':
        return <Truck className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'preparing':
        return 'Preparando';
      case 'ready':
        return 'Listo';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Type-safe column definitions
  type ColumnDefinition = {
    key: keyof Order;
    title: string;
    render: (value: any) => React.ReactNode;
  };

  const columns: ColumnDefinition[] = [
    {
      key: 'id',
      title: 'ID',
      render: (value: string) => <span className="font-mono text-sm">#{value.slice(-6)}</span>,
    },
    {
      key: 'createdAt',
      title: 'Fecha',
      render: (value: Date) => <span className="text-sm">{formatDate(value)}</span>,
    },
    {
      key: 'items',
      title: 'Items',
      render: (value: any[]) => (
        <span className="text-sm">
          {value.length} {value.length === 1 ? 'item' : 'items'}
        </span>
      ),
    },
    {
      key: 'total',
      title: 'Total',
      render: (value: number) => (
        <span className="font-medium text-sm">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      render: (value: OrderStatus) => (
        <div className="flex items-center">
          {getStatusIcon(value)}
          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
            {getStatusText(value)}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Truck className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
        <p className="text-gray-500">
          No hay pedidos que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron pedidos
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.render(order[column.key])}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => onViewDetails(order)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {/* Status update dropdown */}
                      <div className="relative group">
                        <Button
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        
                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'confirmed')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Confirmar pedido
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'preparing')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Comenzar preparación
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'ready')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Marcar como listo
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button
                              onClick={() => onUpdateStatus(order.id, 'delivered')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Marcar como entregado
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <>
                              <div className="border-t my-1"></div>
                              <button
                                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Cancelar pedido
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;