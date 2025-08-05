import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { CartItem } from '../../../contexts/CartContext';

interface PreOrderConfirmationProps {
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
  scheduledFor: Date;
  onClose: () => void;
}

export const PreOrderConfirmation: React.FC<PreOrderConfirmationProps> = ({
  orderId,
  items,
  total,
  deliveryAddress,
  paymentMethod,
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
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pre-pedido confirmado!
        </h2>
        <p className="text-gray-600">
          Tu pre-pedido #{orderId.slice(-6).toUpperCase()} está programado exitosamente
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Fecha y hora programada</h3>
        <p className="text-blue-800">
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
        <p className="text-sm text-blue-600 mt-2">
          Te enviaremos un recordatorio 30 minutos antes de la hora programada
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pre-pedido</h3>
        
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

      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Importante</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Podrás modificar tu pre-pedido hasta 2 horas antes de la hora programada</li>
          <li>• Recibirás notificaciones sobre el estado de tu pedido</li>
          <li>• El pastelero comenzará a preparar tu pedido 30 minutos antes de la hora acordada</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleTrackOrder} className="flex-1">
          Ver detalles del pre-pedido
        </Button>
        <Button onClick={handleViewOrders} variant="outline" className="flex-1">
          Ver todos mis pedidos
        </Button>
      </div>
    </div>
  );
};