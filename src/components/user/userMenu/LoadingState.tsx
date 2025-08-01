import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando pasteles...</p>
      </div>
    </div>
  );
};

export default LoadingState;