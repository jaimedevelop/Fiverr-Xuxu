import React from 'react';
import { Heart, Eye, ShoppingCart, Plus, Check } from 'lucide-react';
import { Pastry } from '../../../types/pastry';
import { useCart } from '../../../contexts/CartContext';
import PriceDisplay from './PriceDisplay';
import AvailabilityBadge from './AvailabilityBadge';
import ImageDisplay from './ImageDisplay';
import FavoriteButton from './FavoriteButton';

interface PastryCardProps {
  pastry: Pastry;
  onClick: () => void;
}

const PastryCard = ({ pastry, onClick }: PastryCardProps) => {
  const { addItem, items } = useCart();
  
  // Check if this pastry is already in cart
  const isInCart = items.some(item => 
    item.pastryId === pastry.id && item.businessId === pastry.businessId
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pastry.available) return;
    
    addItem({
      pastryId: pastry.id,
      businessId: pastry.businessId,
      name: pastry.name,
      price: pastry.price,
      quantity: 1
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        {/* Image */}
        <div className="aspect-square w-full overflow-hidden bg-gray-100">
          <ImageDisplay
            images={pastry.images}
            alt={pastry.name}
            className="w-full h-full"
          />
        </div>
        
        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <AvailabilityBadge available={pastry.available} inventory={pastry.inventory} />
        </div>
        
        {/* View Details Button */}
        <button
          onClick={onClick}
          className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
          aria-label="Ver detalles"
        >
          <Eye className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{pastry.name}</h3>
          <FavoriteButton pastryId={pastry.id} />
        </div>
        
        <p className="mt-1 text-gray-600 text-sm line-clamp-2">
          {pastry.description}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <PriceDisplay price={pastry.price} />
          <button
            onClick={onClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Ver detalles
          </button>
        </div>
        
        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            disabled={!pastry.available}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all ${
              pastry.available
                ? isInCart 
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!pastry.available ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                No Disponible
              </>
            ) : isInCart ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Añadir Más
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Añadir al Carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastryCard;