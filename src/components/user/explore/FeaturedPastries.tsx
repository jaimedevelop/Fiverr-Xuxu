import React, { memo } from 'react';
import { Plus, Check } from 'lucide-react';
import { Pastry } from '../../../types/pastry';
import { useCart } from '../../../contexts/CartContext';
import ImageDisplay from '../userMenu/ImageDisplay';

interface FeaturedPastriesProps {
  pastries: Pastry[];
  maxItems?: number;
  onPastryClick?: (pastry: Pastry) => void;
}

const FeaturedPastries: React.FC<FeaturedPastriesProps> = memo(({
  pastries,
  maxItems = 4,
  onPastryClick
}) => {
  const { addItem, items } = useCart();
  const displayedPastries = pastries.slice(0, maxItems);
  const remainingCount = Math.max(0, pastries.length - maxItems);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const isInCart = (pastry: Pastry) => {
    return items.some(item => 
      item.pastryId === pastry.id && item.businessId === pastry.businessId
    );
  };

  const handleAddToCart = (e: React.MouseEvent, pastry: Pastry) => {
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

  if (pastries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Featured pastries grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {displayedPastries.map((pastry) => {
          const inCart = isInCart(pastry);
          
          return (
            <div
              key={pastry.id}
              className="group cursor-pointer"
              onClick={() => onPastryClick?.(pastry)}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
                {/* Use ImageDisplay component for consistent image handling */}
                <ImageDisplay
                  images={pastry.images}
                  alt={pastry.name}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Price badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {formatCurrency(pastry.price)}
                </div>

                {/* Add to Cart Button */}
                {pastry.available && (
                  <button
                    onClick={(e) => handleAddToCart(e, pastry)}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 ${
                      inCart
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label={inCart ? 'Añadir más' : 'Añadir al carrito'}
                  >
                    {inCart ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                )}

                {/* Availability overlay */}
                {!pastry.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      No disponible
                    </span>
                  </div>
                )}
              </div>
              
              {/* Pastry name */}
              <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {pastry.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Show remaining count */}
      {remainingCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            +{remainingCount} producto{remainingCount !== 1 ? 's' : ''} más
          </p>
        </div>
      )}
    </div>
  );
});

FeaturedPastries.displayName = 'FeaturedPastries';

export default FeaturedPastries;