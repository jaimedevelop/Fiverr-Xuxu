// src/components/user/userMenu/PriceDisplay.tsx
import React from 'react';

interface PriceDisplayProps {
  price: number;
}

const PriceDisplay = ({ price }: PriceDisplayProps) => {
  return (
    <span className="text-lg font-bold bg-gradient-saffron-text bg-clip-text text-transparent">
      ${price.toFixed(2)} <span className="text-sm font-medium text-slate">MXN</span>
    </span>
  );
};

export default PriceDisplay;