import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { CartItem } from '../../../contexts/CartContext';
import { getButtonClass, colors } from '../../../utils/themeHelper';

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
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-mint rounded-full flex items-center justify-center mx-auto mb-6 shadow-mint animate-pulse">
          <svg className="w-10 h-10 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-700 mb-3">
          ¡Pedido confirmado!
        </h2>
        <p className="text-lg text-gray-600">
          Tu pedido <span className="font-semibold text-saffron-600">#{orderId.slice(-6).toUpperCase()}</span> ha sido recibido exitosamente
        </p>
      </div>

      <div className="card-base p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
          <div className="w-6 h-6 bg-gradient-saffron rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-orange-800" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          Resumen del pedido
        </h3>
        
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div key={item.id} className={`flex justify-between items-start p-4 rounded-xl ${index % 2 === 0 ? 'bg-gradient-to-r from-saffron-50 to-persian-pink-50' : 'bg-gradient-to-r from-persian-pink-50 to-saffron-50'}`}>
              <div className="flex-1">
                <p className="font-medium text-gray-700">{item.name}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-600">Cantidad: <span className="font-semibold">{item.quantity}</span></p>
                  <p className="text-sm text-gray-600">Precio: <span className="font-semibold">${item.price.toFixed(2)}</span></p>
                </div>
              </div>
              <p className="font-semibold text-gray-700 bg-white/80 px-3 py-1 rounded-full">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-saffron-200 pt-6">
          <div className="flex justify-between items-center bg-gradient-saffron rounded-xl p-4 shadow-saffron">
            <span className="text-lg font-semibold text-orange-900">Total</span>
            <span className="text-2xl font-bold text-orange-900">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card-base p-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <div className="w-5 h-5 bg-gradient-persian-pink rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-pink-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            Dirección de entrega
          </h4>
          <div className="text-gray-600 space-y-1">
            <p className="font-medium">{deliveryAddress.street} #{deliveryAddress.number}</p>
            {deliveryAddress.apartment && <p>{deliveryAddress.apartment}</p>}
            <p>{deliveryAddress.neighborhood}, {deliveryAddress.city}</p>
            <p>C.P. {deliveryAddress.postalCode}</p>
          </div>
        </div>

        <div className="card-base p-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <div className="w-5 h-5 bg-gradient-mint rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-emerald-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            Método de pago
          </h4>
          <p className="text-gray-600 font-medium">{paymentMethod}</p>
        </div>
      </div>

      {scheduledFor ? (
        <div className="card-base p-6 mb-8 border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
            <div className="w-5 h-5 bg-gradient-purple rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            Pedido programado
          </h4>
          <p className="text-purple-700">
            Tu pedido está programado para:
          </p>
          <p className="text-lg font-semibold text-purple-800 mt-2">
            {scheduledFor.toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} a las {scheduledFor.toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      ) : estimatedDelivery && (
        <div className="card-base p-6 mb-8 border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            Tiempo estimado
          </h4>
          <p className="text-blue-700">
            Tu pedido llegará aproximadamente a las{' '}
            <span className="font-semibold text-blue-800">
              {estimatedDelivery.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleTrackOrder}
          className={`${getButtonClass('primary')} flex-1`}
        >
          Rastrear pedido
        </button>
        <button
          onClick={handleViewOrders}
          className={`${getButtonClass('outline')} flex-1`}
        >
          Ver mis pedidos
        </button>
      </div>

      <div className="mt-8 text-center">
        <div className="card-base p-4 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
          <p className="text-sm text-gray-600">
            ¡Gracias por tu pedido! Recibirás notificaciones sobre el estado de tu pedido.
          </p>
        </div>
      </div>
    </div>
  );
};