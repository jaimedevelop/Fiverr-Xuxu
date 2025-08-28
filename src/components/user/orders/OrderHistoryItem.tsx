import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { OrderStatusBadge, OrderStatus } from './OrderStatusBadge';
import { CartItem } from '../../../contexts/CartContext';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import { MapPin, Clock, Package, RefreshCw } from 'lucide-react';

interface OrderHistoryItemProps {
  order: {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: Date;
    scheduledFor?: Date;
    deliveryAddress: {
      street: string;
      number: string;
      neighborhood: string;
    };
  };
  onReorder: (orderId: string) => void;
}

export const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({ 
  order, 
  onReorder 
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/orders/${order.id}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'from-saffron-100 to-yellow-100 border-saffron-200';
      case 'confirmed':
      case 'preparing':
        return 'from-purple-100 to-blue-100 border-purple-200';
      case 'ready':
        return 'from-emerald-100 to-mint-100 border-emerald-200';
      case 'delivered':
        return 'from-gray-100 to-slate-100 border-gray-200';
      case 'cancelled':
        return 'from-red-100 to-pink-100 border-red-200';
      default:
        return 'from-gray-100 to-slate-100 border-gray-200';
    }
  };

  return (
    <div className={`card-base p-6 hover:shadow-brand-lg transition-all duration-300 bg-gradient-to-br ${getStatusColor(order.status)}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center shadow-saffron">
            <Package className="w-4 h-4 text-orange-800" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">
              Pedido #{order.id.slice(-6).toUpperCase()}
            </h4>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <Clock className="w-3 h-3 mr-1 text-saffron-600" />
              {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
            </div>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-saffron-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Artículos</span>
            <span className="text-lg font-semibold text-gray-700">
              {order.items.length}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="truncate">
                • {item.name} (x{item.quantity})
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-saffron-600 font-medium">
                +{order.items.length - 2} más...
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-persian-pink-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-xl font-bold text-gradient-saffron">
              ${order.total.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            MXN incluye impuestos
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-start space-x-2 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
          <MapPin className="w-4 h-4 text-persian-pink-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 mb-1">Dirección de entrega</p>
            <p className="text-xs text-gray-600 truncate">
              {order.deliveryAddress.street} #{order.deliveryAddress.number}, {order.deliveryAddress.neighborhood}
            </p>
          </div>
        </div>
      </div>

      {order.scheduledFor && (
        <div className="mb-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Pedido programado</p>
                <p className="text-xs text-purple-600">
                  {formatDate(order.scheduledFor)} a las {formatTime(order.scheduledFor)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleViewDetails}
          className={`${getButtonClass('outline')} flex-1 text-sm`}
        >
          Ver detalles
        </button>
        <button
          onClick={() => onReorder(order.id)}
          className={`${getButtonClass('primary')} flex-1 text-sm flex items-center justify-center gap-2`}
        >
          <RefreshCw className="w-4 h-4" />
          Reordenar
        </button>
      </div>
    </div>
  );
};