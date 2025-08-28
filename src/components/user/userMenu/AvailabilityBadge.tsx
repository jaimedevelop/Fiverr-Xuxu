// src/components/user/common/AvailabilityBadge.tsx
import React from 'react';
import { Check, X } from 'lucide-react';
import { ThemeHelper } from '../../../utils/themeHelper';

interface AvailabilityBadgeProps {
  available: boolean;
  inventory: number;
}

const AvailabilityBadge = ({ available, inventory }: AvailabilityBadgeProps) => {
  const availabilityStyle = ThemeHelper.getAvailabilityStyle(available, inventory);
  
  if (!available) {
    return (
      <span className={`${availabilityStyle.className} inline-flex items-center whitespace-nowrap`}>
        <X className="h-3 w-3 mr-1 flex-shrink-0" />
        <span className="truncate">{availabilityStyle.text}</span>
      </span>
    );
  }
  
  if (inventory > 0 && inventory <= 5) {
    return (
      <span className={`${availabilityStyle.className} inline-flex items-center whitespace-nowrap`}>
        <span className="truncate">{availabilityStyle.text}</span>
      </span>
    );
  }
  
  return (
    <span className={`${availabilityStyle.className} inline-flex items-center whitespace-nowrap`}>
      <Check className="h-3 w-3 mr-1 flex-shrink-0" />
      <span className="truncate">{availabilityStyle.text}</span>
    </span>
  );
};

export default AvailabilityBadge;