import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Clock } from 'lucide-react';
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
  const { addItem } = useCart();
  const [showPreOrderModal, setShowPreOrderModal] = useState(false);

  if (!pastry) return null;

  const handleAddToCart = () => {
    addItem({
      pastryId: pastry.id,
      name: pastry.name,
      price: pastry.price,
      quantity: 1
    });
  };

  const handlePreOrder = () => {
    setShowPreOrderModal(true);
  };

  const handlePreOrderComplete = () => {
    // This would typically show a success message
    console.log('Pre-order completed successfully');
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
                    {pastry.available ? 'Añadir al Carrito' : 'No Disponible'}
                  </button>
                  
                  {pastry.available && (
                    <button
                      onClick={handlePreOrder}
                      className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock size={18} />
                      Pre-order
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