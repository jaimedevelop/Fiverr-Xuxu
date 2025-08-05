import React from 'react';
import { CartItem } from '../../../contexts/CartContext';

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
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h3>
      
      {/* Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
              {item.notes && (
                <p className="text-xs text-gray-500 italic mt-1">Notas: {item.notes}</p>
              )}
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">IVA</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold border-t pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Address */}
      {deliveryAddress && (
        <div className="mt-4 pt-4 border-t">
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
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Método de pago</h4>
          <p className="text-sm text-gray-600">{paymentMethod.name}</p>
          <p className="text-xs text-gray-500">{paymentMethod.description}</p>
        </div>
      )}

      {/* Scheduled Time */}
      {scheduledFor && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Fecha y hora programada</h4>
          <p className="text-sm text-gray-600">
            {scheduledFor.toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            <br />
            {scheduledFor.toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </div>
  );
};