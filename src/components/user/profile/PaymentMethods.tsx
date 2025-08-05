import React from 'react';
import Button from '../../ui/Button';

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'digital';
  name: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  onSelect: (methodId: string) => void;
  onEdit: (methodId: string) => void;
  onDelete: (methodId: string) => void;
  onAddNew: () => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  methods,
  onSelect,
  onEdit,
  onDelete,
  onAddNew
}) => {
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return '💳';
      case 'cash':
        return '💵';
      case 'digital':
        return '📱';
      default:
        return '💳';
    }
  };

  if (methods.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay métodos de pago guardados</h3>
        <p className="mt-1 text-sm text-gray-500">
          Agrega métodos de pago para hacer tus pedidos más rápido
        </p>
        <div className="mt-6">
          <Button onClick={onAddNew}>Agregar método</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Métodos de pago</h3>
        <Button onClick={onAddNew} className="text-sm">
          Agregar nuevo
        </Button>
      </div>

      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getPaymentIcon(method.type)}</span>
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{method.name}</p>
                    {method.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Predeterminado
                      </span>
                    )}
                  </div>
                  {method.type === 'card' && method.last4 && (
                    <p className="text-sm text-gray-600">
                      •••• {method.last4} {method.brand && `• ${method.brand}`}
                      {method.expiryMonth && method.expiryYear && 
                        ` • Exp ${method.expiryMonth}/${method.expiryYear.toString().slice(-2)}`
                      }
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onSelect(method.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Seleccionar
                </button>
                <button
                  onClick={() => onEdit(method.id)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Editar
                </button>
                {!method.isDefault && (
                  <button
                    onClick={() => onDelete(method.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};