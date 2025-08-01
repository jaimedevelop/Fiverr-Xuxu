// src/utils/passwordStrength.ts

export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length contributes up to 50% of strength
  strength += Math.min(password.length / 16, 1) * 50;
  
  // Character variety contributes up to 50% of strength
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const varietyCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
  strength += (varietyCount / 4) * 50;
  
  return Math.min(strength, 100);
};

export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength > 70) return 'Fuerte';
  if (strength > 40) return 'Media';
  return 'Débil';
};

export const getPasswordStrengthColor = (strength: number): string => {
  if (strength > 70) return 'bg-green-500';
  if (strength > 40) return 'bg-yellow-500';
  return 'bg-red-500';
};