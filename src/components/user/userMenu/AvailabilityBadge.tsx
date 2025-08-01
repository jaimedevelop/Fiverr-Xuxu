import React from 'react';
import { Check, X } from 'lucide-react';

interface AvailabilityBadgeProps {
  available: boolean;
  inventory: number;
}

const AvailabilityBadge = ({ available, inventory }: AvailabilityBadgeProps) => {
  if (!available) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <X className="mr-1 h-3 w-3" />
        No disponible
      </span>
    );
  }
  
  if (inventory > 0 && inventory <= 5) {
    if (inventory === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          ¡Queda 1!
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        ¡Quedan {inventory}!
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <Check className="mr-1 h-3 w-3" />
      Disponible
    </span>
  );
};

export default AvailabilityBadge;