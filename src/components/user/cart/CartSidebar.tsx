import React, { useState } from 'react';
import { X, ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import CartItem from './CartItem';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import OrderModal from '../orders/OrderModal';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Sidebar */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">Tu Carrito</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-3 h-7 flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Cerrar panel</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner />
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 p-4 rounded-md">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                        <ShoppingBag className="h-full w-full" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
                      <p className="text-gray-500 mb-4">
                        Añade algunos pasteles para comenzar.
                      </p>
                      <Button
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        Explorar Pasteles
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="mt-8">
                        <div className="flow-root">
                          <ul className="-my-6 divide-y divide-gray-200">
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

                      {/* Cart Summary */}
                      <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>{formatCurrency(total)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Envío e impuestos calculados al finalizar.
                        </p>
                        <div className="mt-6">
                          <Button
                            onClick={handleCheckout}
                            className="w-full flex items-center justify-center"
                          >
                            Finalizar Compra
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-4 flex justify-center text-sm text-center text-gray-500">
                          <p>
                            o{' '}
                            <button
                              type="button"
                              onClick={() => setIsOpen(false)}
                              className="text-blue-600 font-medium hover:text-blue-500"
                            >
                              continuar comprando
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>

                      {/* Clear Cart Button */}
                      {items.length > 0 && (
                        <div className="px-4 sm:px-6 pb-6">
                          <button
                            onClick={clearCart}
                            className="w-full text-center text-sm text-red-600 hover:text-red-800"
                          >
                            Vaciar carrito
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderContent()}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onOrderComplete={handleOrderComplete}
      />
    </>
  );
};

export default CartSidebar;