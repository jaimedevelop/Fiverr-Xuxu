// src/components/user/userMenu/EmptyState.tsx - Updated to support business-specific messaging
import React from 'react';
import { Search, Package } from 'lucide-react';

interface EmptyStateProps {
  hasSearch?: boolean;
  businessName?: string; // NEW: For business-specific messaging
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  hasSearch = false, 
  businessName 
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
        {hasSearch ? (
          <Search className="h-full w-full" />
        ) : (
          <Package className="h-full w-full" />
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasSearch ? 'No se encontraron productos' : 'No hay productos disponibles'}
      </h3>
      
      <p className="text-gray-500 max-w-md mx-auto">
        {hasSearch ? (
          businessName ? (
            <>
              No encontramos productos en <strong>{businessName}</strong> que coincidan con tu búsqueda. 
              Intenta con diferentes términos o explora otras categorías.
            </>
          ) : (
            'No encontramos productos que coincidan con tu búsqueda. Intenta con diferentes términos o explora otras categorías.'
          )
        ) : (
          businessName ? (
            <>
              <strong>{businessName}</strong> aún no ha agregado productos a su menú. 
              Vuelve pronto para ver las novedades.
            </>
          ) : (
            'Aún no hay productos disponibles en este momento. Vuelve pronto para ver las novedades.'
          )
        )}
      </p>
      
      {hasSearch && (
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpiar filtros y ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;