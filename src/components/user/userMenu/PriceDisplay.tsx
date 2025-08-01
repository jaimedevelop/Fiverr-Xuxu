import React from 'react';

interface PriceDisplayProps {
  price: number;
}

const PriceDisplay = ({ price }: PriceDisplayProps) => {
  return (
    <span className="text-lg font-bold text-gray-900">
      ${price.toFixed(2)} <span className="text-sm font-normal text-gray-500">MXN</span>
    </span>
  );
};

export default PriceDisplay;