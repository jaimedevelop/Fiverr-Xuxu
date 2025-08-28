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
      className="relative p-2 text-gray-600 hover:text-saffron-600 focus:outline-none transition-all duration-300 hover:scale-105"
      aria-label="Carrito de compras"
    >
      <ShoppingCart className="h-6 w-6" />
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-saffron text-orange-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-saffron animate-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      
      {itemCount > 0 && total > 0 && (
        <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-persian-pink-500 to-persian-pink-600 text-white text-xs font-medium rounded-full px-2 py-0.5 shadow-pink min-w-max">
          {formatCurrency(total)}
        </span>
      )}
    </button>
  );
};

export default CartIcon;