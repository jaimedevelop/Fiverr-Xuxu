// src/components/admin/settings/NotificationsSettings.tsx - Extracted from GeneralSettings
import React, { useState, useEffect } from 'react';
import { Save, Bell, Mail } from 'lucide-react';
import Button from '../../ui/Button';
import BaseCard from '../../common/BaseCard';
import FormError from '../../common/FormError';

interface NotificationsSettingsProps {
  loading?: boolean;
  error?: string | null;
}

interface NotificationConfig {
  enableNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  orderConfirmationMessage: string;
  orderReadyMessage: string;
}

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({
  loading = false,
  error = null
}) => {
  const [config, setConfig] = useState<NotificationConfig>({
    enableNotifications: true,
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    orderConfirmationMessage: 'Gracias por tu orden. Hemos recibido tu pedido y lo estamos procesando.',
    orderReadyMessage: 'Tu orden está lista para recoger. ¡Gracias por tu compra!'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Mock data for development - In real app, fetch from API
    setConfig({
      enableNotifications: true,
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      orderConfirmationMessage: 'Gracias por tu orden. Hemos recibido tu pedido y lo estamos procesando.',
      orderReadyMessage: 'Tu orden está lista para recoger. ¡Gracias por tu compra!'
    });
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!config.orderConfirmationMessage?.trim()) {
      newErrors.orderConfirmationMessage = 'El mensaje de confirmación es requerido';
    }

    if (!config.orderReadyMessage?.trim()) {
      newErrors.orderReadyMessage = 'El mensaje de orden lista es requerido';
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
      // In real app, save to API
      console.log('Saving notification settings:', config);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving notification settings:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setConfig(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <BaseCard title="Configuración de Notificaciones">
      {error && <div className="mb-6"><FormError message={error} /></div>}

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">¡Éxito!</h3>
              <p className="text-sm text-green-700 mt-1">
                La configuración de notificaciones se guardó correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-green-500" />
            Tipos de Notificaciones
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center">
                <input
                  id="enableNotifications"
                  name="enableNotifications"
                  type="checkbox"
                  checked={config.enableNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-900">
                  Habilitar Notificaciones
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Activa las notificaciones del sistema.
              </p>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="enableEmailNotifications"
                  name="enableEmailNotifications"
                  type="checkbox"
                  checked={config.enableEmailNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableEmailNotifications" className="ml-2 block text-sm text-gray-900">
                  Notificaciones por Email
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Envía notificaciones por correo electrónico.
              </p>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="enableSmsNotifications"
                  name="enableSmsNotifications"
                  type="checkbox"
                  checked={config.enableSmsNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableSmsNotifications" className="ml-2 block text-sm text-gray-900">
                  Notificaciones por SMS
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Envía notificaciones por mensaje de texto.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-purple-500" />
            Mensajes de Notificación
          </h3>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="orderConfirmationMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje de Confirmación de Orden
              </label>
              <textarea
                id="orderConfirmationMessage"
                name="orderConfirmationMessage"
                rows={3}
                value={config.orderConfirmationMessage}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.orderConfirmationMessage && <FormError message={errors.orderConfirmationMessage} />}
              <p className="mt-1 text-xs text-gray-500">
                Este mensaje se envía a los clientes cuando confirman su orden.
              </p>
            </div>

            <div>
              <label htmlFor="orderReadyMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje de Orden Lista
              </label>
              <textarea
                id="orderReadyMessage"
                name="orderReadyMessage"
                rows={3}
                value={config.orderReadyMessage}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              {errors.orderReadyMessage && <FormError message={errors.orderReadyMessage} />}
              <p className="mt-1 text-xs text-gray-500">
                Este mensaje se envía a los clientes cuando su orden está lista para recoger.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Templates Section */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-indigo-500" />
            Plantillas de Notificación
          </h3>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Bell className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Variables Disponibles</h4>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-3">
                    Puedes usar las siguientes variables en tus mensajes, que se reemplazarán automáticamente:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div><code className="bg-blue-100 px-1 rounded text-xs">{'{cliente_nombre}'}</code> - Nombre del cliente</div>
                      <div><code className="bg-blue-100 px-1 rounded text-xs">{'{numero_orden}'}</code> - Número de orden</div>
                      <div><code className="bg-blue-100 px-1 rounded text-xs">{'{fecha_orden}'}</code> - Fecha de la orden</div>
                    </div>
                    <div className="space-y-1">
                      <div><code className="bg-blue-100 px-1 rounded text-xs">{'{tienda_nombre}'}</code> - Nombre de la tienda</div>
                      <div><code className="bg-blue-100 px-1 rounded text-xs">{'{tienda_telefono}'}</code> - Teléfono de la tienda</div>
                      <div><code className="bg-blue-100 px-1 rounded text-xs">{'{total_orden}'}</code> - Total de la orden</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Notificaciones'}
          </Button>
        </div>
      </form>
    </BaseCard>
  );
};

export default NotificationsSettings;