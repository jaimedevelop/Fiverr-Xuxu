// src/components/user/common/LoadingState.tsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron-200 border-t-saffron-500 mx-auto"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-saffron opacity-20 animate-pulse"></div>
        </div>
        <p className="mt-4 text-slate font-medium">Cargando pasteles...</p>
        <div className="mt-2 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-saffron-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-saffron-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-saffron-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;