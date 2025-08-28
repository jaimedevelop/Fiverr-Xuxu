// src/components/user/userMenu/EmptyState.tsx
import React from 'react';
import { Search, Package } from 'lucide-react';

interface EmptyStateProps {
  hasSearch?: boolean;
  businessName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  hasSearch = false, 
  businessName 
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-slate mb-4">
        {hasSearch ? (
          <Search className="h-full w-full" />
        ) : (
          <Package className="h-full w-full" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-charcoal mb-2">
        {hasSearch ? 'No se encontraron productos' : 'No hay productos disponibles'}
      </h3>
      
      <p className="text-slate max-w-md mx-auto leading-relaxed">
        {hasSearch ? (
          businessName ? (
            <>
              No encontramos productos en <span className="font-medium text-saffron-600">{businessName}</span> que coincidan con tu búsqueda. 
              Intenta con diferentes términos o explora otras categorías.
            </>
          ) : (
            'No encontramos productos que coincidan con tu búsqueda. Intenta con diferentes términos o explora otras categorías.'
          )
        ) : (
          businessName ? (
            <>
              <span className="font-medium text-saffron-600">{businessName}</span> aún no ha agregado productos a su menú. 
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
            className="text-saffron-600 hover:text-saffron-700 font-medium transition-colors duration-200"
          >
            Limpiar filtros y ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;