import React, { useState } from 'react';
import { X, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import CartItem from './CartItem';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import OrderModal from '../orders/OrderModal';
import { getButtonClass, colors } from '../../../utils/themeHelper';

const CartSidebar: React.FC = () => {
  const {
    items,
    itemCount,
    total,
    loading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
    isOpen,
    setIsOpen
  } = useCart();
  
  const { authState } = useAuth();
  const { user } = authState;
  
  const [showOrderModal, setShowOrderModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const handleCheckout = () => {
    if (!user) {
      // In a real app, this would redirect to login
      alert('Debes iniciar sesión para continuar con la compra');
      return;
    }
    
    // Close cart and open order modal
    setIsOpen(false);
    setShowOrderModal(true);
  };

  const handleOrderComplete = () => {
    // This would typically show a success message or redirect to order tracking
    console.log('Order completed successfully');
  };

  const handleEditNotes = (id: string, notes: string) => {
    // In a real implementation, this would update the item's notes
    console.log(`Updating notes for item ${id}:`, notes);
  };

  // Don't render cart sidebar if it's not open
  if (!isOpen) {
    // Still render the OrderModal even when cart is closed
    return (
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Cart Sidebar */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white/95 backdrop-blur-sm shadow-brand-xl">
              {/* Header */}
              <div className="bg-gradient-saffron shadow-saffron">
                <div className="flex items-start justify-between p-6">
                  <h2 className="text-lg font-semibold text-orange-900">Tu Carrito</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="ml-3 p-2 rounded-xl text-orange-700 hover:text-orange-900 hover:bg-orange-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <span className="sr-only">Cerrar panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
                      <p className="text-gray-600 font-medium">Cargando carrito...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="card-base p-4 border border-red-200 bg-red-50">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {!loading && !error && (
                  <>
                    {items.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-6 shadow-saffron">
                          <ShoppingBag className="h-10 w-10 text-orange-800" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Tu carrito está vacío</h3>
                        <p className="text-gray-600 mb-6">
                          Añade algunos postres deliciosos para comenzar.
                        </p>
                        <button
                          onClick={() => setIsOpen(false)}
                          className={getButtonClass('primary')}
                        >
                          Explorar Postres
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4">
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-saffron-200">
                              {items.map((item) => (
                                <li key={item.id} className="py-6">
                                  <CartItem
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeItem}
                                    onEditNotes={handleEditNotes}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Cart Footer - Only show if there are items */}
              {!loading && !error && items.length > 0 && (
                <div className="border-t border-saffron-200 bg-gradient-to-r from-saffron-50 to-persian-pink-50 p-4 sm:p-6">
                  {/* Cart Summary */}
                  <div className="space-y-4">
                    <div className="card-base p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-medium text-gray-700">Subtotal</span>
                        <span className="text-xl font-bold text-gradient-saffron">{formatCurrency(total)}</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-600 text-center">
                        Envío e impuestos calculados al finalizar.
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        className={`${getButtonClass('primary')} w-full flex items-center justify-center gap-2`}
                      >
                        Finalizar Compra
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="text-saffron-600 font-medium hover:text-saffron-800 text-sm transition-colors duration-200"
                        >
                          continuar comprando
                          <span aria-hidden="true"> →</span>
                        </button>
                      </div>
                    </div>

                    {/* Clear Cart Button */}
                    <div className="pt-2 border-t border-saffron-200">
                      <button
                        onClick={clearCart}
                        className="w-full text-center text-sm text-red-600 hover:text-red-800 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                      >
                        Vaciar carrito
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OrderModal - Always render when showOrderModal is true */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onOrderComplete={handleOrderComplete}
      />
    </>
  );
};

export default CartSidebar;