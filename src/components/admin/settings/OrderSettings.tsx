// src/components/admin/settings/OrderSettings.tsx
import React, { useState, useEffect } from 'react';
import { Clock, Settings, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import Button from '../../ui/Button';
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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">¡Éxito!</h3>
              <p className="text-sm text-green-700 mt-1">
                La configuración de pedidos se guardó correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Timing Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Horarios de Pedido
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="cutoffTime" className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Corte para Siguiente Día
              </label>
              <Select
                id="cutoffTime"
                name="cutoffTime"
                value={settings.cutoffTime}
                onChange={handleInputChange}
                options={timeOptions}
                className="w-full"
              />
              {errors.cutoffTime && <FormError message={errors.cutoffTime} />}
              <p className="mt-1 text-xs text-gray-500">
                Pedidos después de esta hora van para el siguiente día
              </p>
            </div>

            <div>
              <label htmlFor="morningOrderDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                Límite de Pedidos Matutinos
              </label>
              <Select
                id="morningOrderDeadline"
                name="morningOrderDeadline"
                value={settings.morningOrderDeadline}
                onChange={handleInputChange}
                options={timeOptions}
                className="w-full"
              />
              {errors.morningOrderDeadline && <FormError message={errors.morningOrderDeadline} />}
              <p className="mt-1 text-xs text-gray-500">
                Pedidos antes de esta hora tienen prioridad
              </p>
            </div>

            <div>
              <label htmlFor="sameDayCompletionHour" className="block text-sm font-medium text-gray-700 mb-1">
                Hora Límite de Completado
              </label>
              <Select
                id="sameDayCompletionHour"
                name="sameDayCompletionHour"
                value={settings.sameDayCompletionHour}
                onChange={handleInputChange}
                options={timeOptions}
                className="w-full"
              />
              {errors.sameDayCompletionHour && <FormError message={errors.sameDayCompletionHour} />}
              <p className="mt-1 text-xs text-gray-500">
                Pedidos prioritarios listos hasta esta hora
              </p>
            </div>
          </div>
        </div>

        {/* Queue Settings Section */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-500" />
            Configuración de Cola
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center">
                <input
                  id="enableOrderQueue"
                  name="enableOrderQueue"
                  type="checkbox"
                  checked={settings.enableOrderQueue}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableOrderQueue" className="ml-2 block text-sm text-gray-900">
                  Habilitar Cola de Pedidos
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Permite pedidos fuera de horario
              </p>
            </div>

            <div>
              <label htmlFor="defaultQueueDelay" className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Procesamiento Estándar
              </label>
              <Select
                id="defaultQueueDelay"
                name="defaultQueueDelay"
                value={settings.defaultQueueDelay.toString()}
                onChange={handleInputChange}
                options={delayOptions}
                className="w-full"
              />
              {errors.defaultQueueDelay && <FormError message={errors.defaultQueueDelay} />}
              <p className="mt-1 text-xs text-gray-500">
                Tiempo estimado para completar un pedido
              </p>
            </div>

            <div>
              <label htmlFor="minOrderAdvanceTime" className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo Mínimo de Anticipación
              </label>
              <Select
                id="minOrderAdvanceTime"
                name="minOrderAdvanceTime"
                value={settings.minOrderAdvanceTime.toString()}
                onChange={handleInputChange}
                options={advanceTimeOptions}
                className="w-full"
              />
              {errors.minOrderAdvanceTime && <FormError message={errors.minOrderAdvanceTime} />}
              <p className="mt-1 text-xs text-gray-500">
                Tiempo mínimo requerido para programar pedidos
              </p>
            </div>
          </div>
        </div>

        {/* Order Logic Summary */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-500" />
            Resumen de Lógica de Pedidos
          </h3>

          <div className="bg-gray-50 p-4 rounded-md">
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Pedidos después de las <strong>{settings.cutoffTime}</strong> se programan para el siguiente día
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Pedidos entre las 9:00 AM y <strong>{settings.morningOrderDeadline}</strong> tienen prioridad y pueden estar listos hasta las  <strong>{settings.sameDayCompletionHour}</strong>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Pedidos fuera de horario {settings.enableOrderQueue ? 'se agregan a la cola' : 'no son permitidos'}
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Tiempo estándar de procesamiento:  <strong> {settings.defaultQueueDelay} minutos</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </form>
    </BaseCard>
  );
};

export default OrderSettings;