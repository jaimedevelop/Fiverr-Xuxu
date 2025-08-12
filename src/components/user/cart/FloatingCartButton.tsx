import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import Cart from './Cart';

const FloatingCartButton: React.FC = () => {
  const { itemCount, total } = useCart();
  const [showCart, setShowCart] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 z-40"
        aria-label="Ver carrito"
      >
        <div className="flex items-center">
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            
            {/* Item Count Badge */}
            {itemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {itemCount > 99 ? '99+' : itemCount}
              </div>
            )}
          </div>
          
          {/* Total Amount (visible on larger screens) */}
          <div className="ml-3 hidden sm:block">
            <div className="text-sm font-medium">
              {formatCurrency(total)}
            </div>
          </div>
        </div>
      </button>

      {/* Cart Component */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </>
  );
};

export default FloatingCartButton;