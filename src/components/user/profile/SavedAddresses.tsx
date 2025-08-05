import React from 'react';
import Button from '../../ui/Button';

interface Address {
  id: string;
  street: string;
  number: string;
  apartment?: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  instructions?: string;
  isDefault: boolean;
}

interface SavedAddressesProps {
  addresses: Address[];
  onSelect: (addressId: string) => void;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => void;
  onAddNew: () => void;
}

export const SavedAddresses: React.FC<SavedAddressesProps> = ({
  addresses,
  onSelect,
  onEdit,
  onDelete,
  onAddNew
}) => {
  if (addresses.length === 0) {
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay direcciones guardadas</h3>
        <p className="mt-1 text-sm text-gray-500">
          Agrega una dirección para hacer tus pedidos más rápido
        </p>
        <div className="mt-6">
          <Button onClick={onAddNew}>Agregar dirección</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Direcciones guardadas</h3>
        <Button onClick={onAddNew} className="text-sm">
          Agregar nueva
        </Button>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <p className="text-sm font-medium text-gray-900">
                    {address.street} #{address.number}
                    {address.apartment && `, ${address.apartment}`}
                  </p>
                  {address.isDefault && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Predeterminada
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {address.neighborhood}, {address.city}, C.P. {address.postalCode}
                </p>
                {address.instructions && (
                  <p className="text-xs text-gray-500 mt-1">
                    Instrucciones: {address.instructions}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onSelect(address.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Seleccionar
                </button>
                <button
                  onClick={() => onEdit(address.id)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Editar
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => onDelete(address.id)}
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