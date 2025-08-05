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
      className={className}
    >
      {isReordering ? 'Agregando...' : 'Reordenar'}
    </Button>
  );
};