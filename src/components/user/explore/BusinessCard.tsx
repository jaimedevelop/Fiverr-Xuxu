// src/components/user/explore/BusinessCard.tsx - No Ratings Version
import React, { useCallback, useMemo, memo } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Business } from '../../../types/business';
import { Pastry } from '../../../types/pastry';
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
    <div className="card-base bg-white/95 backdrop-blur-sm border-2 border-white/50 overflow-hidden shadow-md hover:shadow-xl hover:border-saffron-200 transition-all duration-300">
      {/* Business Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-saffron-50/30 to-orange-50/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Business Logo or Initial */}
            <div className="flex-shrink-0">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${business.storeName} logo`}
                  className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
                  onError={handleLogoError}
                />
              ) : null}
              <div 
                className={`h-14 w-14 rounded-full bg-gradient-to-br from-saffron-100 to-orange-100 flex items-center justify-center shadow-md ${
                  business.logoUrl ? 'hidden' : ''
                }`}
              >
                <span className="text-xl font-bold text-orange-800">
                  {businessInitial}
                </span>
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 truncate mb-1">
                {business.storeName}
              </h3>
              
              {/* Location */}
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-1 text-saffron-600" />
                <span className="truncate font-medium">{locationText}</span>
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
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-gray-800">
            Productos destacados
          </h4>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
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
      <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
        <Button
          onClick={handleViewMenuClick}
          className="btn-primary w-full group flex items-center justify-center hover:scale-105 transition-all duration-300"
        >
          <span className="font-semibold">Ver menú completo</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  );
});

BusinessCard.displayName = 'BusinessCard';

export default BusinessCard;