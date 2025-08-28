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
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 110-2h4zM9 6h6v10a1 1 0 01-1 1H10a1 1 0 01-1-1V6z" />
          </svg>
        </div>
        <p className="text-sm text-gray-500 font-medium">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square shadow-md hover:shadow-lg transition-all duration-300">
                {/* Use ImageDisplay component for consistent image handling */}
                <ImageDisplay
                  images={pastry.images}
                  alt={pastry.name}
                  className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Price badge */}
                <div className="absolute bottom-2 right-2 bg-gradient-to-r from-gray-900 to-black text-white text-xs px-2 py-1 rounded-lg font-semibold shadow-md">
                  {formatCurrency(pastry.price)}
                </div>

                {/* Add to Cart Button */}
                {pastry.available && (
                  <button
                    onClick={(e) => handleAddToCart(e, pastry)}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                      inCart
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-emerald'
                        : 'bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-saffron-50 hover:text-orange-800 border border-white/50'
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
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <span className="text-white text-sm font-semibold bg-red-500 px-3 py-1 rounded-lg">
                      No disponible
                    </span>
                  </div>
                )}
              </div>
              
              {/* Pastry name */}
              <p className="mt-3 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-saffron-600 transition-colors duration-200">
                {pastry.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Show remaining count */}
      {remainingCount > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-saffron-50 to-orange-50 border border-saffron-200 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 mr-2 text-saffron-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-semibold text-orange-800">
              {remainingCount} producto{remainingCount !== 1 ? 's' : ''} más
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

FeaturedPastries.displayName = 'FeaturedPastries';

export default FeaturedPastries;