import React from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  hasSearch: boolean;
}

const EmptyState = ({ hasSearch }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Search className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasSearch ? 'No se encontraron pasteles' : 'No hay pasteles disponibles'}
      </h3>
      <p className="text-gray-500 max-w-md">
        {hasSearch
          ? 'Intenta con otros términos de búsqueda o selecciona otra categoría.'
          : 'Vuelve a visitar más tarde para ver nuestros deliciosos pasteles.'}
      </p>
    </div>
  );
};

export default EmptyState;