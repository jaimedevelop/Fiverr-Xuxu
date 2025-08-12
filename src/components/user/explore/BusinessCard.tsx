// src/components/user/explore/BusinessCard.tsx - Clean Production Version
import React, { useCallback, useMemo, memo } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Business } from '../../../types/business';
import { Pastry } from '../../../types/pastry';
import RatingDisplay from '../../ui/RatingDisplay';
import BusinessStatus from '../../ui/BusinessStatus';
import FeaturedPastries from './FeaturedPastries';
import Button from '../../ui/Button';

interface BusinessCardProps {
  business: Business;
  featuredPastries: Pastry[];
  onViewMenu: (businessId: string) => void;
  onPastryClick?: (pastry: Pastry) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = memo(({
  business,
  featuredPastries,
  onViewMenu,
  onPastryClick
}) => {
  const businessInitial = useMemo(() => {
    return business.storeName.charAt(0).toUpperCase();
  }, [business.storeName]);

  const locationText = useMemo(() => {
    const { colonia, municipality } = business.address;
    if (colonia && municipality) {
      return `${colonia}, ${municipality}`;
    }
    return colonia || municipality || 'Ubicación no especificada';
  }, [business.address.colonia, business.address.municipality]);

  const handleViewMenuClick = useCallback(() => {
    onViewMenu(business.id);
  }, [business.id, onViewMenu]);

  const handleLogoError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Business Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Business Logo or Initial */}
            <div className="flex-shrink-0">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${business.storeName} logo`}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={handleLogoError}
                />
              ) : null}
              <div 
                className={`h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center ${
                  business.logoUrl ? 'hidden' : ''
                }`}
              >
                <span className="text-lg font-bold text-blue-600">
                  {businessInitial}
                </span>
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {business.storeName}
              </h3>
              
              {/* Rating */}
              <RatingDisplay 
                rating={business.averageRating}
                totalReviews={business.totalReviews}
                size="sm"
                disabled={true}
              />
              
              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{locationText}</span>
              </div>
            </div>
          </div>

          {/* Business Status */}
          <div className="flex-shrink-0">
            <BusinessStatus 
              operatingHours={business.operatingHours}
              size="sm"
              showIcon={false}
            />
          </div>
        </div>
      </div>

      {/* Featured Pastries */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            Productos destacados
          </h4>
          <span className="text-xs text-gray-500">
            {featuredPastries.length} producto{featuredPastries.length !== 1 ? 's' : ''}
          </span>
        </div>

        <FeaturedPastries
          pastries={featuredPastries}
          maxItems={4}
          onPastryClick={onPastryClick}
        />
      </div>

      {/* View Menu Button */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Button
          variant="outline"
          onClick={handleViewMenuClick}
          className="w-full group flex items-center justify-center"
        >
          <span>Ver menú completo</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
});

BusinessCard.displayName = 'BusinessCard';

export default BusinessCard;