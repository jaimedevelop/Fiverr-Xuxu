import React from 'react';
import { CartItem } from '../../../contexts/CartContext';
import { ShoppingBag, MapPin, CreditCard, Clock, Calendar } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress?: {
    street: string;
    number: string;
    apartment?: string;
    neighborhood: string;
    city: string;
    postalCode: string;
  };
  paymentMethod?: {
    name: string;
    description: string;
  };
  scheduledFor?: Date;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  deliveryFee,
  tax,
  total,
  deliveryAddress,
  paymentMethod,
  scheduledFor
}) => {
  return (
    <div className="card-base p-6 bg-gradient-to-r from-saffron-50 to-persian-pink-50 border border-saffron-200">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center mr-3 shadow-saffron">
          <ShoppingBag className="w-5 h-5 text-orange-800" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Resumen del pedido</h3>
      </div>
      
      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <div key={item.id} className={`flex justify-between items-start p-4 rounded-xl ${
            index % 2 === 0 
              ? 'bg-gradient-to-r from-saffron-100 to-persian-pink-100' 
              : 'bg-gradient-to-r from-persian-pink-100 to-saffron-100'
          }`}>
            <div className="flex-1">
              <p className="font-medium text-gray-700">{item.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-600">Cantidad: <span className="font-semibold">{item.quantity}</span></span>
                <span className="text-sm text-gray-600">Precio: <span className="font-semibold">${item.price.toFixed(2)}</span></span>
              </div>
              {item.notes && (
                <p className="text-xs text-persian-pink-700 bg-persian-pink-50 px-3 py-1 rounded-lg mt-2 italic">
                  Notas: {item.notes}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700 bg-white/80 px-3 py-1 rounded-full">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-saffron-300 pt-6 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Envío</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>IVA</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center bg-gradient-saffron rounded-xl p-4 shadow-saffron">
          <span className="text-lg font-bold text-orange-900">Total</span>
          <span className="text-2xl font-bold text-orange-900">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      {deliveryAddress && (
        <div className="mt-6 pt-6 border-t border-saffron-300">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gradient-persian-pink rounded-lg flex items-center justify-center mr-2">
              <MapPin className="w-4 h-4 text-pink-800" />
            </div>
            <h4 className="font-semibold text-gray-700">Dirección de entrega</h4>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-persian-pink-200">
            <p className="text-gray-700 leading-relaxed">
              {deliveryAddress.street} #{deliveryAddress.number}
              {deliveryAddress.apartment && `, ${deliveryAddress.apartment}`}
              <br />
              {deliveryAddress.neighborhood}, {deliveryAddress.city}
              <br />
              C.P. {deliveryAddress.postalCode}
            </p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <div className="mt-6 pt-6 border-t border-saffron-300">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gradient-mint rounded-lg flex items-center justify-center mr-2">
              <CreditCard className="w-4 h-4 text-emerald-800" />
            </div>
            <h4 className="font-semibold text-gray-700">Método de pago</h4>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200">
            <p className="font-medium text-gray-700">{paymentMethod.name}</p>
            <p className="text-sm text-gray-600 mt-1">{paymentMethod.description}</p>
          </div>
        </div>
      )}

      {/* Scheduled Time */}
      {scheduledFor && (
        <div className="mt-6 pt-6 border-t border-saffron-300">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gradient-purple rounded-lg flex items-center justify-center mr-2">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-gray-700">Fecha y hora programada</h4>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <p className="font-medium text-purple-800">
              {scheduledFor.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-purple-700 mt-1">
              {scheduledFor.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      )}

      {/* Important Note */}
      <div className="mt-6 pt-6 border-t border-saffron-300">
        <div className="flex items-start space-x-2 bg-gradient-to-r from-saffron-100 to-persian-pink-100 rounded-xl p-4 border border-saffron-200">
          <Clock className="w-4 h-4 text-saffron-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-saffron-800 mb-1">Información importante</p>
            <p className="text-xs text-saffron-700">
              Los tiempos de entrega son estimados y pueden variar según la demanda del día. 
              Te notificaremos cualquier cambio por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};