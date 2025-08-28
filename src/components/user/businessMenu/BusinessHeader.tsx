// src/components/user/businessMenu/BusinessHeader.tsx - No Ratings Version
import React from 'react';
import { ArrowLeft, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Business } from '../../../types/business';
import BusinessStatus from '../../ui/BusinessStatus';
import Button from '../../ui/Button';

interface BusinessHeaderProps {
  business: Business;
  onBack: () => void;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  business,
  onBack
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
    <div className="card-base bg-white/95 backdrop-blur-sm shadow-lg border-b border-saffron-100">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-saffron-600 transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Volver a Explorar</span>
        </button>

        {/* Business Info */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
          {/* Left Side - Business Details */}
          <div className="flex items-start space-x-6">
            {/* Business Logo */}
            <div className="flex-shrink-0">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`${business.storeName} logo`}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-saffron-100 to-orange-100 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-3xl font-bold text-orange-800">
                    {getBusinessInitial(business.storeName)}
                  </span>
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                {business.storeName}
              </h1>

              {/* Business Status */}
              <div className="mb-4">
                <BusinessStatus 
                  operatingHours={business.operatingHours}
                  size="md"
                  showNextChange={true}
                />
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {business.phone && (
                  <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                    <Phone className="h-4 w-4 mr-3 text-saffron-600" />
                    <span className="font-medium">{business.phone}</span>
                  </div>
                )}

                <div className="flex items-start text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-saffron-600" />
                  <span className="break-words font-medium">{getFullAddress()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3">
            {/* Call Button */}
            {business.phone && (
              <Button
                onClick={handleCall}
                className="btn-outline flex items-center hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              >
                <Phone className="h-4 w-4 mr-2 text-gray-600" />
                <span className="hidden sm:inline font-semibold">Llamar</span>
              </Button>
            )}

            {/* View Map Button */}
            <Button
              onClick={handleViewMap}
              className="btn-outline flex items-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <ExternalLink className="h-4 w-4 mr-2 text-gray-600" />
              <span className="hidden sm:inline font-semibold">Ver mapa</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHeader;