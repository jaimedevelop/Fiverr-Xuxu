// src/components/user/userMenu/PastryCard.tsx
import React from 'react';
import { Eye, ShoppingCart, Plus, Check } from 'lucide-react';
import { Pastry } from '../../../types/pastry';
import { useCart } from '../../../contexts/CartContext'; // ENABLED
import PriceDisplay from './PriceDisplay';
import AvailabilityBadge from './AvailabilityBadge';
import ImageDisplay from './ImageDisplay';

interface PastryCardProps {
  pastry: Pastry;
  onClick: () => void;
}

const PastryCard = ({ pastry, onClick }: PastryCardProps) => {
  // ENABLED - Cart functionality
  const { addItem, items } = useCart();
  
  // Check if this pastry is already in cart
  const isInCart = items.some(item => 
    item.pastryId === pastry.id && item.businessId === pastry.businessId
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!pastry.available) return;
    
    // ENABLED - Cart functionality restored
    addItem({
      pastryId: pastry.id,
      businessId: pastry.businessId,
      name: pastry.name,
      price: pastry.price,
      quantity: 1
    });
  };

  return (
    <div className="card-interactive">
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
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-brand-lg hover:bg-white hover:scale-110 transition-all duration-300"
          aria-label="Ver detalles"
        >
          <Eye className="h-4 w-4 text-charcoal" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-charcoal">{pastry.name}</h3>
        </div>
        
        <p className="mt-1 text-slate text-sm line-clamp-2">
          {pastry.description}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <PriceDisplay price={pastry.price} />
          <button
            onClick={onClick}
            className="text-sm font-medium text-saffron-600 hover:text-saffron-700 transition-colors duration-200"
          >
            Ver detalles
          </button>
        </div>
        
        <div className="mt-3">
          <button
            onClick={handleAddToCart}
            disabled={!pastry.available}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
              pastry.available
                ? isInCart 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'btn-primary'
                : 'bg-gray-200 text-slate cursor-not-allowed opacity-60'
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