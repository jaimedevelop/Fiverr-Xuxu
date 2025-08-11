// src/components/user/explore/FeaturedPastries.tsx - Using ImageDisplay Component
import React, { memo } from 'react';
import { Pastry } from '../../../types/pastry';
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
  const displayedPastries = pastries.slice(0, maxItems);
  const remainingCount = Math.max(0, pastries.length - maxItems);

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
        {displayedPastries.map((pastry) => (
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
                ${pastry.price}
              </div>
            </div>
            
            {/* Pastry name */}
            <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {pastry.name}
            </p>
          </div>
        ))}
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