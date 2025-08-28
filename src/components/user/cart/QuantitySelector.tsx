import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false
}) => {
  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center bg-white/90 backdrop-blur-sm border border-saffron-200 rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={handleDecrement}
        disabled={quantity <= min || disabled}
        className={`p-2.5 transition-all duration-200 ${
          quantity <= min || disabled
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-saffron-600 hover:text-saffron-800 hover:bg-saffron-100 active:bg-saffron-200'
        }`}
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-4 w-4" />
      </button>
      
      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleChange}
        disabled={disabled}
        className="w-12 text-center bg-transparent border-0 focus:ring-0 focus:outline-none font-semibold text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Cantidad"
      />
      
      <button
        onClick={handleIncrement}
        disabled={quantity >= max || disabled}
        className={`p-2.5 transition-all duration-200 ${
          quantity >= max || disabled
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-saffron-600 hover:text-saffron-800 hover:bg-saffron-100 active:bg-saffron-200'
        }`}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;