// src/components/admin/settings/OrderSettings.tsx - Theme Converted
import React, { useState, useEffect } from 'react';
import { Clock, Settings, AlertCircle, CheckCircle, Save, Calendar, Timer, Play } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import BaseCard from '../../common/BaseCard';
import Input from '../../common/Input';
import Select from '../../ui/Select';
import FormError from '../../common/FormError';
import { OrderSettings as OrderSettingsType, DEFAULT_ORDER_SETTINGS } from '../../../utils/orderScheduler';

interface OrderSettingsProps {
  initialSettings?: OrderSettingsType;
  onSave: (settings: OrderSettingsType) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const OrderSettings: React.FC<OrderSettingsProps> = ({
  initialSettings,
  onSave,
  loading = false,
  error = null
}) => {
  const [settings, setSettings] = useState<OrderSettingsType>(
    initialSettings || DEFAULT_ORDER_SETTINGS
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const timeOptions = [
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '12:30', label: '12:30 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '17:30', label: '5:30 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '18:30', label: '6:30 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '19:30', label: '7:30 PM' },
    { value: '20:00', label: '8:00 PM' },
    { value: '20:30', label: '8:30 PM' },
    { value: '21:00', label: '9:00 PM' }
  ];

  const delayOptions = [
    { value: '15', label: '15 minutos' },
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '60', label: '1 hora' },
    { value: '90', label: '1.5 horas' },
    { value: '120', label: '2 horas' },
    { value: '150', label: '2.5 horas' },
    { value: '180', label: '3 horas' }
  ];

  const advanceTimeOptions = [
    { value: '15', label: '15 minutos' },
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '60', label: '1 hora' },
    { value: '120', label: '2 horas' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate cutoff time is before 24:00
    if (!settings.cutoffTime) {
      newErrors.cutoffTime = 'La hora de corte es requerida';
    }

    // Validate morning deadline is before cutoff time
    if (!settings.morningOrderDeadline) {
      newErrors.morningOrderDeadline = 'La hora límite matutina es requerida';
    } else if (settings.morningOrderDeadline >= settings.cutoffTime) {
      newErrors.morningOrderDeadline = 'La hora límite debe ser anterior a la hora de corte';
    }

    // Validate same day completion hour
    if (!settings.sameDayCompletionHour) {
      newErrors.sameDayCompletionHour = 'La hora de completado es requerida';
    } else if (settings.sameDayCompletionHour <= settings.morningOrderDeadline) {
      newErrors.sameDayCompletionHour = 'La hora de completado debe ser posterior a la hora límite matutina';
    }

    // Validate queue delay
    if (settings.defaultQueueDelay < 15) {
      newErrors.defaultQueueDelay = 'El tiempo mínimo es 15 minutos';
    }

    // Validate advance time
    if (settings.minOrderAdvanceTime < 15) {
      newErrors.minOrderAdvanceTime = 'El tiempo mínimo es 15 minutos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      await onSave(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving order settings:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'defaultQueueDelay' || name === 'minOrderAdvanceTime') {
      setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }

    // Clear errors when field changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <BaseCard title="Configuración de Pedidos">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <h3 className="text-sm font-semibold text-emerald-800">¡Configuración Guardada!</h3>
              <p className="text-sm text-emerald-700">
                La configuración de pedidos se guardó correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Order Timing Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-blue-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Resumen de Lógica de Pedidos
              </h3>
              <p className="text-sm text-gray-600">
                Visualiza cómo funcionan tus configuraciones actuales
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4">Reglas Configuradas:</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">1</span>
                </div>
                <div>
                  <span className="font-medium">Corte diario:</span> Pedidos después de las{' '}
                  <span className="font-semibold text-orange-600">{settings.cutoffTime}</span>{' '}
                  se programan para el siguiente día
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <div>
                  <span className="font-medium">Pedidos prioritarios:</span> Entre las 9:00 AM y{' '}
                  <span className="font-semibold text-green-600">{settings.morningOrderDeadline}</span>{' '}
                  pueden estar listos hasta las{' '}
                  <span className="font-semibold text-green-600">{settings.sameDayCompletionHour}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-indigo-600">3</span>
                </div>
                <div>
                  <span className="font-medium">Cola de pedidos:</span>{' '}
                  {settings.enableOrderQueue ? (
                    <span className="text-emerald-600 font-semibold">Habilitada</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Deshabilitada</span>
                  )}{' '}
                  para pedidos fuera de horario
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">4</span>
                </div>
                <div>
                  <span className="font-medium">Tiempo de procesamiento:</span>{' '}
                  <span className="font-semibold text-purple-600">{settings.defaultQueueDelay} minutos</span>{' '}
                  estándar por pedido
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-pink-600">5</span>
                </div>
                <div>
                  <span className="font-medium">Anticipación mínima:</span>{' '}
                  <span className="font-semibold text-pink-600">{settings.minOrderAdvanceTime} minutos</span>{' '}
                  requeridos para programar
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className={getButtonClass('admin')}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </BaseCard>
  );
};

export default OrderSettings;