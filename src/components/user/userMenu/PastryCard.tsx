import React from 'react';
import { Heart, Eye } from 'lucide-react';
import { Pastry } from '../../../types/pastry';
import PriceDisplay from './PriceDisplay';
import AvailabilityBadge from './AvailabilityBadge';
import ImageDisplay from './ImageDisplay';
import FavoriteButton from './FavoriteButton';

interface PastryCardProps {
  pastry: Pastry;
  onClick: () => void;
}

const PastryCard = ({ pastry, onClick }: PastryCardProps) => {
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
      </div>
    </div>
  );
};

export default PastryCard;