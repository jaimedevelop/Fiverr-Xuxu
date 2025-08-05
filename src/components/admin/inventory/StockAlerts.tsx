import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { StockAlert } from '../../../types/inventory';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';

interface StockAlertsProps {
  alerts: StockAlert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
  loading?: boolean;
}

const StockAlerts: React.FC<StockAlertsProps> = ({ 
  alerts, 
  onAcknowledge, 
  onDismiss, 
  loading = false 
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <BaseCard title="Alertas de Stock">
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-green-500 mb-4">
            <Check className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas</h3>
          <p className="text-gray-500">
            Todos tus productos tienen niveles de stock adecuados.
          </p>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Alertas de Stock">
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-lg border ${
              alert.severity === 'critical' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className={`flex-shrink-0 p-1 rounded-full ${
                  alert.severity === 'critical' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    {alert.severity === 'critical' ? 'Stock crítico' : 'Stock bajo'}: {alert.pastryName}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>
                      Stock actual: {alert.currentStock} (Mínimo: {alert.minimumStock})
                    </p>
                    <p className="mt-1">
                      Creada: {formatDate(alert.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {!alert.acknowledged && (
                  <Button
                    variant="outline"
                    onClick={() => onAcknowledge(alert.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onDismiss(alert.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {alert.acknowledged && (
              <div className="mt-2 text-xs text-gray-500">
                Reconocida: {alert.acknowledgedAt ? formatDate(alert.acknowledgedAt) : 'N/A'}
              </div>
            )}
          </div>
        ))}
      </div>
    </BaseCard>
  );
};

export default StockAlerts;