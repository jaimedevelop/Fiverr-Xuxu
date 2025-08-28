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
        className="fixed bottom-6 right-6 bg-gradient-saffron text-orange-900 rounded-full p-4 shadow-brand-xl hover:shadow-saffron transition-all duration-300 transform hover:scale-105 z-40 backdrop-blur-sm border border-saffron-300"
        aria-label="Ver carrito"
      >
        <div className="flex items-center">
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            
            {/* Item Count Badge */}
            {itemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-persian-pink-500 to-persian-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-pink animate-bounce">
                {itemCount > 99 ? '99+' : itemCount}
              </div>
            )}
          </div>
          
          {/* Total Amount (visible on larger screens) */}
          <div className="ml-3 hidden sm:block">
            <div className="text-sm font-semibold text-orange-800">
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