// src/components/common/FormError.tsx
import React from 'react';

interface FormErrorProps {
  message: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <p className="mt-1 text-sm text-red-600 font-medium">
      {message}
    </p>
  );
};

export default FormError;