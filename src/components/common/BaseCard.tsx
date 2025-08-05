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
    <div className={`bg-white rounded-lg border shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      {(title || actions) && (
        <div className="px-6 py-4 border-b flex justify-between items-start">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
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
        <div className="px-6 py-4 bg-red-50 border-b">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="px-6 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        /* Content */
        <div className="px-6 py-4">
          {children}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          {footer}
        </div>
      )}
    </div>
  );
};

export default BaseCard;