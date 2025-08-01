// src/components/common/PasswordStrength.tsx
import React from 'react';
import { calculatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '../../utils/passwordStrength';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const strength = calculatePasswordStrength(password);
  const strengthLabel = getPasswordStrengthLabel(strength);
  const strengthColor = getPasswordStrengthColor(strength);
  
  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${strengthColor}`} 
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      <div className="text-xs mt-1 text-gray-500">
        Fuerza: {strengthLabel}
      </div>
    </div>
  );
};

export default PasswordStrength;