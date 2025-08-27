// src/components/common/PasswordStrength.tsx
import React from 'react';
import { calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../utils/passwordStrength';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const strength = calculatePasswordStrength(password);
  const strengthLabel = getPasswordStrengthLabel(strength);
  
  // Theme-aware color mapping
  const getStrengthColor = (strength: number) => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-amber-500';
    if (strength < 75) return 'bg-saffron-500';
    return 'bg-emerald-500';
  };
  
  const getStrengthTextColor = (strength: number) => {
    if (strength < 25) return 'text-red-600';
    if (strength < 50) return 'text-amber-600';
    if (strength < 75) return 'text-saffron-600';
    return 'text-emerald-600';
  };
  
  const strengthColor = getStrengthColor(strength);
  const strengthTextColor = getStrengthTextColor(strength);
  
  return (
    <div className="mt-2 space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ease-out ${strengthColor}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      <div className={`text-xs font-medium ${strengthTextColor}`}>
        Fuerza: {strengthLabel}
      </div>
    </div>
  );
};

export default PasswordStrength;