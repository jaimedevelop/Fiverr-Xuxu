// src/components/ui/BusinessStatus.tsx
import React from 'react';
import { Clock } from 'lucide-react';
import { OperatingHours } from '../../types/business';
import { getBusinessStatus } from '../../utils/businessHours';

interface BusinessStatusProps {
  operatingHours: OperatingHours;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showNextChange?: boolean;
}

const BusinessStatus: React.FC<BusinessStatusProps> = ({
  operatingHours,
  size = 'md',
  showIcon = true,
  showNextChange = false
}) => {
  const status = getBusinessStatus(operatingHours);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getStatusColors = () => {
    if (status.isOpen) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: 'text-green-600'
      };
    } else {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: 'text-red-600'
      };
    }
  };

  const colors = getStatusColors();

  return (
    <div className="flex items-center space-x-1">
      {showIcon && (
        <Clock className={`${iconSizeClasses[size]} ${colors.icon}`} />
      )}
      
      <div className="flex flex-col">
        {/* Main status */}
        <span 
          className={`
            ${sizeClasses[size]} ${colors.text} font-medium
            px-2 py-1 rounded-md ${colors.bg}
            inline-flex items-center
          `}
        >
          {status.statusText}
        </span>

        {/* Next change info (if requested and available) */}
        {showNextChange && status.nextChange && (
          <span className={`${sizeClasses[size]} text-gray-500 mt-1`}>
            {status.nextChange.action === 'opens' ? 'Abre' : 'Cierra'} {status.nextChange.time}
          </span>
        )}
      </div>
    </div>
  );
};

export default BusinessStatus;