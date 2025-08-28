import React from 'react';
import { X, Edit } from 'lucide-react';
import { CartItem as CartItemType } from '../../../contexts/CartContext';
import QuantitySelector from './QuantitySelector';
import PriceDisplay from '../../user/userMenu/PriceDisplay';
import { getButtonClass, colors } from '../../../utils/themeHelper';

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
    <div className="flex items-start py-4 border-b border-saffron-200">
      {/* Item Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-saffron rounded-xl overflow-hidden shadow-saffron">
        <div className="w-full h-full flex items-center justify-center text-orange-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
      </div>
      
      {/* Item Details */}
      <div className="ml-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-700">{item.name}</h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all duration-200"
            aria-label="Eliminar artículo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <PriceDisplay price={item.price} />
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(quantity) => onUpdateQuantity(item.id, quantity)}
          />
        </div>
        
        {/* Item Total */}
        <div className="mt-2 text-right">
          <span className="text-sm font-semibold text-gray-700 bg-gradient-to-r from-saffron-100 to-persian-pink-100 px-3 py-1 rounded-full">
            Total: {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
        
        {/* Notes */}
        {onEditNotes && (
          <div className="mt-3">
            {isEditingNotes ? (
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-base text-sm resize-none"
                  placeholder="Notas especiales..."
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveNotes}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelNotes}
                    className="btn-outline text-xs px-3 py-1"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {notes ? (
                  <div className="text-xs text-persian-pink-700 bg-persian-pink-50 px-3 py-1.5 rounded-xl flex-1 mr-2">
                    {notes}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl flex-1 mr-2">
                    Sin notas especiales
                  </div>
                )}
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-saffron-600 hover:text-saffron-800 p-1.5 rounded-lg hover:bg-saffron-100 transition-all duration-200"
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