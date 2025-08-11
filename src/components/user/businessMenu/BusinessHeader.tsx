// src/components/user/businessMenu/BusinessHeader.tsx
import React from 'react';
import { ArrowLeft, MapPin, Phone, Heart, ExternalLink } from 'lucide-react';
import { Business } from '../../../types/business';
import RatingDisplay from '../../ui/RatingDisplay';
import BusinessStatus from '../../ui/BusinessStatus';
import Button from '../../ui/Button';

interface BusinessHeaderProps {
  business: Business;
  onBack: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  business,
  onBack,
  onToggleFavorite,
  isFavorite = false
}) => {
  const getBusinessInitial = (storeName: string) => {
    return storeName.charAt(0).toUpperCase();
  };

  const getFullAddress = () => {
    const { street, colonia, municipality, state, postalCode } = business.address;
    const parts = [street, colonia, municipality, state, postalCode].filter(Boolean);
    return parts.join(', ');
  };

  const handleCall = () => {
    if (business.phone) {
      window.location.href = `tel:${business.phone}`;
    }
  };

  const handleViewMap = () => {
    const address = getFullAddress();
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Volver a Explorar</span>
        </button>

        {/* Business Info */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          {/* Left Side - Business Details */}
          <div className="flex items-start space-x-4">
            {/* Business Logo */}
            <div className="flex-shrink-0">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${business.storeName} logo`}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {getBusinessInitial(business.storeName)}
                  </span>
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {business.storeName}
              </h1>

              {/* Rating */}
              <div className="mb-2">
                <RatingDisplay 
                  rating={business.averageRating}
                  totalReviews={business.totalReviews}
                  size="md"
                  disabled={true}
                />
              </div>

              {/* Business Status */}
              <div className="mb-3">
                <BusinessStatus 
                  operatingHours={business.operatingHours}
                  size="md"
                  showNextChange={true}
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {business.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{business.phone}</span>
                  </div>
                )}

                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{getFullAddress()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3">
            {/* Favorite Button */}
            <Button
              variant="outline"
              onClick={() => {
                // Temporarily show alert since favorites are disabled
                alert('Funcionalidad de favoritos temporalmente deshabilitada');
                // onToggleFavorite?.();
              }}
              className="flex items-center"
            >
              <Heart 
                className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
              />
              <span className="hidden sm:inline">
                {isFavorite ? 'Favorito' : 'Favorito'}
              </span>
            </Button>

            {/* Call Button */}
            {business.phone && (
              <Button
                variant="outline"
                onClick={handleCall}
                className="flex items-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Llamar</span>
              </Button>
            )}

            {/* View Map Button */}
            <Button
              variant="outline"
              onClick={handleViewMap}
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ver mapa</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;