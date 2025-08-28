// src/components/user/common/ErrorState.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2">Error</h3>
      <p className="text-slate max-w-md leading-relaxed">{message}</p>
    </div>
  );
};

export default ErrorState;