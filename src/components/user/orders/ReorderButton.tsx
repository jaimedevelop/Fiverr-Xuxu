import React from 'react';
import { useCart } from '../../../contexts/CartContext';
import Button from '../../ui/Button';

interface ReorderButtonProps {
  orderId: string;
  items: Array<{
    pastryId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }>;
  onReorderComplete?: () => void;
  className?: string;
}

export const ReorderButton: React.FC<ReorderButtonProps> = ({
  orderId,
  items,
  onReorderComplete,
  className
}) => {
  const { addItem } = useCart();
  const [isReordering, setIsReordering] = React.useState(false);

  const handleReorder = async () => {
    setIsReordering(true);
    
    try {
      // Add all items to cart
      for (const item of items) {
        addItem({
          pastryId: item.pastryId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes
        });
      }
      
      onReorderComplete?.();
    } catch (error) {
      console.error('Error reordering items:', error);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <Button
      onClick={handleReorder}
      disabled={isReordering}
      className={`btn-primary transition-all duration-300 ${
        isReordering 
          ? 'opacity-75 cursor-not-allowed transform scale-95' 
          : 'hover:scale-105 hover:shadow-saffron'
      } ${className || ''}`}
    >
      {isReordering ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-orange-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Agregando...
        </span>
      ) : (
        <span className="flex items-center font-semibold">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reordenar
        </span>
      )}
    </Button>
  );
};