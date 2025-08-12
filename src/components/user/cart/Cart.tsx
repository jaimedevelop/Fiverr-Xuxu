import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import Button from '../../ui/Button';
import OrderModal from '../orders/OrderModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { 
    items, 
    itemCount, 
    total, 
    removeItem, 
    updateQuantity, 
    clearCart,
    getBusinessIds,
    getItemsByBusiness 
  } = useCart();
  
  const [showOrderModal, setShowOrderModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      setShowOrderModal(true);
    }
  };

  const handleOrderComplete = () => {
    setShowOrderModal(false);
    onClose();
  };

  if (!isOpen) return null;

  const businessIds = getBusinessIds();

  return (
    <>
      {/* Cart Sidebar */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <h2 className="text-lg font-semibold">
                Carrito ({itemCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex flex-col h-full">
            {items.length === 0 ? (
              // Empty Cart
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-500">
                    Añade algunos productos deliciosos para continuar
                  </p>
                </div>
              </div>
            ) : (
              // Cart Items
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  {businessIds.length > 1 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        🏪 Tienes productos de {businessIds.length} negocios diferentes. 
                        Se crearán pedidos separados.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {businessIds.map(businessId => {
                      const businessItems = getItemsByBusiness(businessId);
                      const businessTotal = businessItems.reduce(
                        (sum, item) => sum + (item.price * item.quantity), 
                        0
                      );

                      return (
                        <div key={businessId} className="space-y-3">
                          {businessIds.length > 1 && (
                            <div className="text-sm font-medium text-gray-600 border-b pb-1">
                              Negocio: {businessId}
                            </div>
                          )}
                          
                          {businessItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {formatCurrency(item.price)} c/u
                                </p>
                                {item.notes && (
                                  <p className="text-xs text-gray-400">
                                    Nota: {item.notes}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                                
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-1 text-red-400 hover:text-red-600 ml-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {businessIds.length > 1 && (
                            <div className="text-right text-sm font-medium text-gray-600">
                              Subtotal: {formatCurrency(businessTotal)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cart Footer */}
                <div className="border-t p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      + Impuestos y gastos de envío (se calculan en checkout)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full"
                      disabled={items.length === 0}
                    >
                      Proceder al Checkout
                    </Button>
                    
                    <button
                      onClick={clearCart}
                      className="w-full text-sm text-gray-500 hover:text-gray-700"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onOrderComplete={handleOrderComplete}
      />
    </>
  );
};

export default Cart;