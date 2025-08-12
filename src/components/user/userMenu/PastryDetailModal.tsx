import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Clock, Plus, Minus } from 'lucide-react';
import { Pastry } from '../../../types/pastry';
import { useCart } from '../../../contexts/CartContext';
import PriceDisplay from './PriceDisplay';
import AvailabilityBadge from './AvailabilityBadge';
import FavoriteButton from './FavoriteButton';
import ImageDisplay from './ImageDisplay';
import PreOrderModal from '../orders/PreOrderModal';

interface PastryDetailModalProps {
  pastry: Pastry | null;
  onClose: () => void;
}

const PastryDetailModal = ({ pastry, onClose }: PastryDetailModalProps) => {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [showPreOrderModal, setShowPreOrderModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!pastry) return null;

  // Check if this pastry is already in cart and get its quantity
  const cartItem = items.find(item => 
    item.pastryId === pastry.id && item.businessId === pastry.businessId
  );
  const currentCartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!pastry.available) return;
    
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
    if (!cartItem) return;
    
    if (newQuantity <= 0) {
      removeItem(cartItem.id);
    } else {
      updateQuantity(cartItem.id, newQuantity);
    }
  };

  const handlePreOrder = () => {
    setShowPreOrderModal(true);
  };

  const handlePreOrderComplete = () => {
    console.log('Pre-order completed successfully');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">{pastry.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
            <div className="md:flex">
              {/* Images */}
              <div className="md:w-1/2 p-6">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <ImageDisplay
                    images={pastry.images}
                    alt={pastry.name}
                    className="w-full h-full"
                  />
                </div>
                
                {pastry.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {pastry.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
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
                  <FavoriteButton pastryId={pastry.id} />
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600">{pastry.description}</p>
                </div>
                
                {pastry.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Etiquetas</h3>
                    <div className="flex flex-wrap gap-2">
                      {pastry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cart Section */}
                {pastry.available && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Añadir al Carrito</h3>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mb-4">
                      <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 border rounded"
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700 border rounded"
                          disabled={quantity >= 99}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        Total: {formatCurrency(pastry.price * quantity)}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas especiales (opcional):
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Sin azúcar, decoración especial..."
                        rows={2}
                        maxLength={200}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {notes.length}/200 caracteres
                      </div>
                    </div>

                    {/* Current Cart Status */}
                    {currentCartQuantity > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-700">
                            Ya tienes {currentCartQuantity} en el carrito
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateCartQuantity(currentCartQuantity - 1)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium text-blue-700">
                              {currentCartQuantity}
                            </span>
                            <button
                              onClick={() => handleUpdateCartQuantity(currentCartQuantity + 1)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!pastry.available}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      pastry.available
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {pastry.available ? 
                      `Añadir ${quantity > 1 ? `${quantity} ` : ''}al Carrito` : 
                      'No Disponible'
                    }
                  </button>
                  
                  {pastry.available && (
                    <button
                      onClick={handlePreOrder}
                      className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock size={18} />
                      Pre-ordenar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PreOrderModal
        isOpen={showPreOrderModal}
        onClose={() => setShowPreOrderModal(false)}
        pastryId={pastry.id}
        pastryName={pastry.name}
        pastryPrice={pastry.price}
        onPreOrderComplete={handlePreOrderComplete}
      />
    </>
  );
};

export default PastryDetailModal;