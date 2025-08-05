import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

const CartIcon: React.FC = () => {
  const { itemCount, total, setIsOpen } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      aria-label="Carrito de compras"
    >
      <ShoppingCart className="h-6 w-6" />
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
      
      {itemCount > 0 && (
        <span className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-xs font-medium rounded px-1 py-0.5">
          {formatCurrency(total)}
        </span>
      )}
    </button>
  );
};

export default CartIcon;