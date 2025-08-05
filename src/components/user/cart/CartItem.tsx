import React from 'react';
import { X, Edit } from 'lucide-react';
import { CartItem as CartItemType } from '../../../contexts/CartContext';
import QuantitySelector from './QuantitySelector';
import PriceDisplay from '../../user/userMenu/PriceDisplay';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onEditNotes?: (id: string, notes: string) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onEditNotes
}) => {
  const [isEditingNotes, setIsEditingNotes] = React.useState(false);
  const [notes, setNotes] = React.useState(item.notes || '');

  const handleSaveNotes = () => {
    if (onEditNotes) {
      onEditNotes(item.id, notes);
      setIsEditingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    setNotes(item.notes || '');
    setIsEditingNotes(false);
  };

  return (
    <div className="flex items-start py-4 border-b border-gray-200">
      {/* Item Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
        {/* In a real app, this would be an actual image */}
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
      </div>
      
      {/* Item Details */}
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500"
            aria-label="Eliminar artículo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-1 flex items-center justify-between">
          <PriceDisplay price={item.price} />
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(quantity) => onUpdateQuantity(item.id, quantity)}
          />
        </div>
        
        {/* Item Total */}
        <div className="mt-1 text-sm font-medium text-gray-900">
          Total: {(item.price * item.quantity).toFixed(2)}
        </div>
        
        {/* Notes */}
        {onEditNotes && (
          <div className="mt-2">
            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notas especiales..."
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveNotes}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelNotes}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                {notes ? (
                  <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {notes}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Sin notas</div>
                )}
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="ml-2 text-gray-400 hover:text-blue-500"
                  aria-label="Editar notas"
                >
                  <Edit className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItemComponent;