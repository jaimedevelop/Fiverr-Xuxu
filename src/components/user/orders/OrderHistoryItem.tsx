import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { OrderStatusBadge, OrderStatus } from './OrderStatusBadge';
import { CartItem } from '../../../contexts/CartContext';

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            Pedido #{order.id.slice(-6).toUpperCase()}
          </h4>
          <p className="text-xs text-gray-500">
            {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600">
          {order.items.length} artículo{order.items.length !== 1 ? 's' : ''}
        </p>
        <p className="text-sm font-medium text-gray-900">
          Total: ${order.total.toFixed(2)}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500">
          Entregar en: {order.deliveryAddress.street} #{order.deliveryAddress.number}, {order.deliveryAddress.neighborhood}
        </p>
      </div>

      {order.scheduledFor && (
        <div className="mb-3">
          <p className="text-xs text-blue-600">
            Programado para: {formatDate(order.scheduledFor)} a las {formatTime(order.scheduledFor)}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleViewDetails}
          variant="outline"
          className="flex-1 text-sm py-2"
        >
          Ver detalles
        </Button>
        <Button
          onClick={() => onReorder(order.id)}
          className="flex-1 text-sm py-2"
        >
          Reordenar
        </Button>
      </div>
    </div>
  );
};