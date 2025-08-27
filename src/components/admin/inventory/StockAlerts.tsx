import React from 'react';
import { AlertTriangle, Check, X, Clock, Package } from 'lucide-react';
import { StockAlert } from '../../../types/inventory';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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

  const getSeverityConfig = (severity: 'low' | 'critical') => {
    if (severity === 'critical') {
      return {
        bgColor: 'bg-gradient-to-r from-red-50 to-red-100',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800',
        textColor: 'text-red-700',
        label: 'Crítico'
      };
    } else {
      return {
        bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
        borderColor: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        titleColor: 'text-amber-800',
        textColor: 'text-amber-700',
        label: 'Stock Bajo'
      };
    }
  };

  if (loading) {
    return (
      <BaseCard title="Alertas de Stock">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center animate-pulse mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-900" />
          </div>
          <div className="space-y-2 text-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-3 bg-gray-100 rounded animate-pulse w-32"></div>
          </div>
          <p className="text-gray-600 font-medium mt-4">Cargando alertas...</p>
        </div>
      </BaseCard>
    );
  }

  if (alerts.length === 0) {
    return (
      <BaseCard title="Alertas de Stock">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-brand-lg">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Todo en orden!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Todos tus productos tienen niveles de stock adecuados. Te notificaremos cuando algún producto 
            necesite reabastecimiento.
          </p>
          
          {/* Status indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <h4 className="font-semibold text-emerald-800 text-sm">Stock Normal</h4>
              <p className="text-xs text-emerald-700 mt-1">Sin alertas activas</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <h4 className="font-semibold text-blue-800 text-sm">Monitoreo Activo</h4>
              <p className="text-xs text-blue-700 mt-1">Control automático</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <h4 className="font-semibold text-purple-800 text-sm">Sistema de Alertas</h4>
              <p className="text-xs text-purple-700 mt-1">Listo para notificar</p>
            </div>
          </div>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Alertas de Stock">
      {/* Alert Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Críticas</p>
              <p className="text-2xl font-bold text-red-900">
                {alerts.filter(a => a.severity === 'critical').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">Stock Bajo</p>
              <p className="text-2xl font-bold text-amber-900">
                {alerts.filter(a => a.severity === 'low').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Reconocidas</p>
              <p className="text-2xl font-bold text-blue-900">
                {alerts.filter(a => a.acknowledged).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Check className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const severityConfig = getSeverityConfig(alert.severity);
          
          return (
            <div 
              key={alert.id} 
              className={`${severityConfig.bgColor} ${severityConfig.borderColor} border rounded-xl p-6 shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Alert Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 ${severityConfig.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
                    <AlertTriangle className={`h-6 w-6 ${severityConfig.iconColor}`} />
                  </div>
                  
                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-sm font-semibold ${severityConfig.titleColor}`}>
                        {severityConfig.label}: {alert.pastryName}
                      </h3>
                      {alert.acknowledged && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Check className="w-3 h-3 mr-1" />
                          Reconocida
                        </span>
                      )}
                    </div>
                    
                    <div className={`space-y-2 text-sm ${severityConfig.textColor}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                          <span>Stock actual: <span className="font-semibold">{alert.currentStock}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                          <span>Stock mínimo: <span className="font-semibold">{alert.minimumStock}</span></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <Clock className="w-3 h-3" />
                        <span>Creada: {formatDate(alert.createdAt)}</span>
                        {alert.acknowledged && alert.acknowledgedAt && (
                          <>
                            <span>•</span>
                            <span>Reconocida: {formatDate(alert.acknowledgedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="w-8 h-8 bg-white/70 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
                      title="Marcar como reconocida"
                    >
                      <Check className="h-4 w-4 text-emerald-600" />
                    </button>
                  )}
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="w-8 h-8 bg-white/70 hover:bg-white rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
                    title="Descartar alerta"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {alerts.filter(a => !a.acknowledged).length} alerta{alerts.filter(a => !a.acknowledged).length !== 1 ? 's' : ''} pendiente{alerts.filter(a => !a.acknowledged).length !== 1 ? 's' : ''}
          </p>
          
          <div className="flex items-center gap-2">
            {alerts.some(a => !a.acknowledged) && (
              <button
                onClick={() => alerts.filter(a => !a.acknowledged).forEach(a => onAcknowledge(a.id))}
                className={getButtonClass('outline')}
              >
                <Check className="h-4 w-4 mr-2" />
                Reconocer todas
              </button>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default StockAlerts;