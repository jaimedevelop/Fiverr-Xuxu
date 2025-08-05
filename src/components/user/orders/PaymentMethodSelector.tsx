import React from 'react';

export interface PaymentMethod {
  id: string;
  type: 'cash' | 'card' | 'digital';
  name: string;
  description: string;
  icon?: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    type: 'cash',
    name: 'Efectivo',
    description: 'Pago en efectivo al recibir tu pedido',
    icon: '💵'
  },
  {
    id: 'card',
    type: 'card',
    name: 'Tarjeta de crédito/débito',
    description: 'Pago con tarjeta al recibir tu pedido',
    icon: '💳'
  },
  {
    id: 'digital',
    type: 'digital',
    name: 'Transferencia digital',
    description: 'Pago por transferencia bancaria o app',
    icon: '📱'
  }
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Método de pago</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod?.id === method.id}
              onChange={() => onSelect(method)}
              className="sr-only"
            />
            
            <div className="flex items-center">
              {method.icon && (
                <span className="text-2xl mr-3">{method.icon}</span>
              )}
              <div>
                <p className="font-medium text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
            
            {selectedMethod?.id === method.id && (
              <div className="ml-auto">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};