import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'nav';
  disabled?: boolean;
  className?: string;
}

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = ''
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'px-6 py-3 rounded-xl bg-gradient-saffron text-orange-900 shadow-saffron hover:scale-105 focus:ring-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    outline: 'px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-saffron-50 hover:text-saffron-700 hover:scale-105 focus:ring-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    nav: 'px-4 py-3 rounded-xl text-gray-700 hover:bg-saffron-50 hover:text-saffron-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;