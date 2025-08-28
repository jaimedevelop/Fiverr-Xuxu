import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import Button from '../../ui/Button';
import OrderModal from '../orders/OrderModal';
import { getButtonClass, colors } from '../../../utils/themeHelper';

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
  const navigate = useNavigate();

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

  const handleExploreProducts = () => {
    onClose();
    navigate('/usuario/explorar');
  };

  if (!isOpen) return null;

  const businessIds = getBusinessIds();

  return (
    <>
      {/* Cart Sidebar */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-sm shadow-brand-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-saffron-200 bg-gradient-saffron">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2 text-orange-800" />
              <h2 className="text-lg font-semibold text-orange-900">
                Carrito ({itemCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-orange-700 hover:text-orange-900 transition-colors duration-200 p-1 rounded-lg hover:bg-orange-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            // Empty Cart
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-saffron rounded-full flex items-center justify-center mx-auto mb-6 shadow-saffron">
                  <ShoppingCart className="h-10 w-10 text-orange-800" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Tu carrito está vacío
                </h3>
                <p className="text-gray-600 mb-6">
                  Añade algunos productos deliciosos para continuar
                </p>
                <button
                  onClick={handleExploreProducts}
                  className={getButtonClass('primary')}
                >
                  Explorar Postres
                </button>
              </div>
            </div>
          ) : (
            // Cart Items with closer positioning
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {businessIds.length > 1 && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-persian-pink-50 to-saffron-50 rounded-xl border border-persian-pink-200">
                    <p className="text-sm text-persian-pink-700">
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
                          <div className="text-sm font-medium text-gray-600 border-b border-saffron-200 pb-2">
                            <span className="bg-gradient-saffron px-3 py-1 rounded-full text-orange-800 text-xs font-semibold">
                              Negocio: {businessId}
                            </span>
                          </div>
                        )}
                        
                        {businessItems.map(item => (
                          <div key={item.id} className="card-base p-4 hover:shadow-brand-lg transition-all duration-300">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-700">{item.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {formatCurrency(item.price)} c/u
                                </p>
                                {item.notes && (
                                  <p className="text-xs text-persian-pink-600 bg-persian-pink-50 px-2 py-1 rounded-lg mt-1">
                                    Nota: {item.notes}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-1.5 text-saffron-600 hover:text-saffron-800 hover:bg-saffron-100 rounded-lg transition-all duration-200"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                
                                <span className="w-8 text-center font-semibold text-gray-700">
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-1.5 text-saffron-600 hover:text-saffron-800 hover:bg-saffron-100 rounded-lg transition-all duration-200"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                                
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200 ml-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-3 text-right">
                              <span className="text-sm font-semibold text-gray-700 bg-saffron-100 px-3 py-1 rounded-full">
                                Subtotal: {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        {businessIds.length > 1 && (
                          <div className="text-right">
                            <span className="text-sm font-semibold text-persian-pink-700 bg-persian-pink-100 px-3 py-2 rounded-xl">
                              Subtotal del negocio: {formatCurrency(businessTotal)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart Footer - Positioned closer to items */}
              <div className="border-t border-saffron-200 bg-gradient-to-r from-saffron-50 to-persian-pink-50 p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-brand-md">
                    <span className="text-lg font-bold text-gray-700">Total:</span>
                    <span className="text-2xl font-bold text-gradient-saffron">{formatCurrency(total)}</span>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    + Impuestos y gastos de envío (se calculan en checkout)
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className={`${getButtonClass('primary')} w-full`}
                    disabled={items.length === 0}
                  >
                    Proceder al Checkout
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 py-2"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </>
          )}
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