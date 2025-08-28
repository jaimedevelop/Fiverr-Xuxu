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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Método de pago</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`card-interactive relative flex items-start p-4 transition-all duration-300 ${
              selectedMethod?.id === method.id
                ? 'border-2 border-saffron-500 bg-gradient-to-r from-saffron-50 to-orange-50 shadow-saffron'
                : 'border border-gray-200 hover:border-saffron-300'
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
                <p className={`font-medium ${
                  selectedMethod?.id === method.id 
                    ? 'text-orange-900' 
                    : 'text-gray-700'
                }`}>
                  {method.name}
                </p>
                <p className={`text-sm ${
                  selectedMethod?.id === method.id 
                    ? 'text-orange-700' 
                    : 'text-gray-600'
                }`}>
                  {method.description}
                </p>
              </div>
            </div>
            
            {selectedMethod?.id === method.id && (
              <div className="ml-auto">
                <div className="w-5 h-5 rounded-full bg-gradient-saffron flex items-center justify-center shadow-md">
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