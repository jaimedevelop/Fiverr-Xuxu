// src/components/user/userMenu/PastryDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Pastry } from '../../../types/pastry';
import { useCart } from '../../../contexts/CartContext'; // ENABLED
import PriceDisplay from './PriceDisplay';
import AvailabilityBadge from './AvailabilityBadge';
import ImageDisplay from './ImageDisplay';

interface PastryDetailModalProps {
  pastry: Pastry | null;
  onClose: () => void;
}

const PastryDetailModal = ({ pastry, onClose }: PastryDetailModalProps) => {
  // ENABLED - Cart functionality
  const { addItem, items, updateQuantity, removeItem } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (pastry) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scrolling
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [pastry]);

  if (!pastry) return null;

  // Check if this pastry is already in cart and get its quantity
  const cartItem = items.find(item => 
    item.pastryId === pastry.id && item.businessId === pastry.businessId
  );
  const currentCartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!pastry.available) return;
    
    // ENABLED - Cart functionality restored
    addItem({
      pastryId: pastry.id,
      businessId: pastry.businessId,
      name: pastry.name,
      price: pastry.price,
      quantity: quantity,
      notes: notes.trim() || undefined
    });

    // Reset form after adding
    setQuantity(1);
    setNotes('');
    
    // Show success feedback
    alert(`${quantity} ${pastry.name} añadido${quantity > 1 ? 's' : ''} al carrito!`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateCartQuantity = (newQuantity: number) => {
    // ENABLED - Cart update functionality restored
    if (!cartItem) return;
    
    if (newQuantity <= 0) {
      removeItem(cartItem.id);
    } else {
      updateQuantity(cartItem.id, newQuantity);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-base max-w-4xl w-full max-h-[95vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200/50">
          <h2 className="text-2xl font-bold text-charcoal">{pastry.name}</h2>
          <button
            onClick={onClose}
            className="text-slate hover:text-charcoal transition-colors duration-200 p-2 rounded-xl hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="md:flex">
            {/* Images */}
            <div className="md:w-1/2 p-6">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <ImageDisplay
                  images={pastry.images}
                  alt={pastry.name}
                  className="w-full h-full"
                />
              </div>
              
              {pastry.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {pastry.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 hover:scale-105 transition-transform duration-200 cursor-pointer">
                      <ImageDisplay
                        images={[image]}
                        alt={`${pastry.name} ${index + 2}`}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="md:w-1/2 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AvailabilityBadge
                      available={pastry.available}
                      inventory={pastry.inventory}
                    />
                  </div>
                  <PriceDisplay price={pastry.price} />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Descripción</h3>
                <p className="text-slate leading-relaxed">{pastry.description}</p>
              </div>
              
              {pastry.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-charcoal mb-2">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {pastry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-saffron-100 to-saffron-200 text-saffron-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cart Section */}
              {pastry.available && (
                <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Añadir al Carrito</h3>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm font-medium text-slate">Cantidad:</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 text-slate hover:text-charcoal border border-gray-200 rounded-xl hover:bg-white transition-colors duration-200"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-charcoal">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 text-slate hover:text-charcoal border border-gray-200 rounded-xl hover:bg-white transition-colors duration-200"
                        disabled={quantity >= 99}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-slate font-medium">
                      Total: {formatCurrency(pastry.price * quantity)}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate mb-1">
                      Notas especiales (opcional):
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input-base"
                      placeholder="Ej: Sin azúcar, decoración especial..."
                      rows={2}
                      maxLength={200}
                    />
                    <div className="text-xs text-slate mt-1">
                      {notes.length}/200 caracteres
                    </div>
                  </div>

                  {/* Current Cart Status */}
                  {currentCartQuantity > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-saffron-50 to-saffron-100 rounded-xl border border-saffron-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-saffron-700 font-medium">
                          Ya tienes {currentCartQuantity} en el carrito
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateCartQuantity(currentCartQuantity - 1)}
                            className="p-1 text-saffron-600 hover:text-saffron-800 transition-colors duration-200"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold text-saffron-700">
                            {currentCartQuantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCartQuantity(currentCartQuantity + 1)}
                            className="p-1 text-saffron-600 hover:text-saffron-800 transition-colors duration-200"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!pastry.available}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    pastry.available
                      ? 'btn-primary'
                      : 'bg-gray-200 text-slate cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShoppingCart size={18} />
                  {pastry.available ? 
                    `Añadir ${quantity > 1 ? `${quantity} ` : ''}al Carrito` : 
                    'No Disponible'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastryDetailModal;