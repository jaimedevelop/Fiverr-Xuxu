import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { CartItem } from '../../../contexts/CartContext';

interface OrderConfirmationProps {
  orderId: string;
  items: CartItem[];
  total: number;
  deliveryAddress: {
    street: string;
    number: string;
    apartment?: string;
    neighborhood: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  estimatedDelivery?: Date;
  scheduledFor?: Date;
  onClose: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  items,
  total,
  deliveryAddress,
  paymentMethod,
  estimatedDelivery,
  scheduledFor,
  onClose
}) => {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    navigate(`/orders/${orderId}`);
    onClose();
  };

  const handleViewOrders = () => {
    navigate('/orders');
    onClose();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pedido confirmado!
        </h2>
        <p className="text-gray-600">
          Tu pedido #{orderId.slice(-6).toUpperCase()} ha sido recibido exitosamente
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h3>
        
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Dirección de entrega</h4>
          <p className="text-sm text-gray-600">
            {deliveryAddress.street} #{deliveryAddress.number}
            {deliveryAddress.apartment && `, ${deliveryAddress.apartment}`}
            <br />
            {deliveryAddress.neighborhood}, {deliveryAddress.city}
            <br />
            C.P. {deliveryAddress.postalCode}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Método de pago</h4>
          <p className="text-sm text-gray-600">{paymentMethod}</p>
        </div>
      </div>

      {scheduledFor ? (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Pedido programado</h4>
          <p className="text-sm text-blue-800">
            Tu pedido está programado para:
            <br />
            <strong>
              {scheduledFor.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} a las {scheduledFor.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </strong>
          </p>
        </div>
      ) : estimatedDelivery && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Tiempo estimado</h4>
          <p className="text-sm text-blue-800">
            Tu pedido llegará aproximadamente a las {estimatedDelivery.toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={handleTrackOrder} className="flex-1">
          Rastrear pedido
        </Button>
        <Button onClick={handleViewOrders} variant="outline" className="flex-1">
          Ver mis pedidos
        </Button>
      </div>
    </div>
  );
};