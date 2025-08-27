// src/components/common/BaseCard.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface BaseCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  footer?: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({
  title,
  description,
  children,
  className = '',
  actions,
  loading = false,
  error,
  footer,
}) => {
  return (
    <div className={`card-base ${className}`}>
      {/* Header */}
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 py-4 bg-red-50/90 backdrop-blur-sm border-b border-red-100">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="px-6 py-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-saffron-500" />
          <span className="ml-3 text-sm text-gray-600 font-medium">Cargando...</span>
        </div>
      ) : (
        /* Content */
        <div className="px-6 py-4">
          {children}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default BaseCard;