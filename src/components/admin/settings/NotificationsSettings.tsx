// src/components/admin/settings/NotificationsSettings.tsx - Theme Converted
import React, { useState, useEffect } from 'react';
import { Save, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <FormError message={error} />
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-800">¡Configuración Guardada!</h3>
              <p className="text-sm text-emerald-700">
                La configuración de notificaciones se guardó correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notification Types Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-emerald-200">
            <div className="w-10 h-10 bg-gradient-mint rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Tipos de Notificaciones
              </h3>
              <p className="text-sm text-gray-600">
                Configura cómo quieres recibir las notificaciones
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-base p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <input
                      id="enableNotifications"
                      name="enableNotifications"
                      type="checkbox"
                      checked={config.enableNotifications}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableNotifications" className="ml-3 block text-sm font-semibold text-gray-900">
                      Habilitar Notificaciones
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Activa las notificaciones del sistema para recibir alertas importantes.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <input
                      id="enableEmailNotifications"
                      name="enableEmailNotifications"
                      type="checkbox"
                      checked={config.enableEmailNotifications}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableEmailNotifications" className="ml-3 block text-sm font-semibold text-gray-900">
                      Notificaciones por Email
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Recibe notificaciones importantes por correo electrónico.
                  </p>
                </div>
              </div>
            </div>

            <div className="card-base p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <input
                      id="enableSmsNotifications"
                      name="enableSmsNotifications"
                      type="checkbox"
                      checked={config.enableSmsNotifications}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableSmsNotifications" className="ml-3 block text-sm font-semibold text-gray-900">
                      Notificaciones por SMS
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Envía notificaciones urgentes por mensaje de texto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Templates Section */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 pb-2 border-b border-pink-200">
            <div className="w-10 h-10 bg-gradient-pink rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-pink-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Mensajes de Notificación
              </h3>
              <p className="text-sm text-gray-600">
                Personaliza los mensajes que reciben tus clientes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="orderConfirmationMessage" className="block text-sm font-semibold text-gray-700 mb-2">
                Mensaje de Confirmación de Orden
              </label>
              <textarea
                id="orderConfirmationMessage"
                name="orderConfirmationMessage"
                rows={4}
                value={config.orderConfirmationMessage}
                onChange={handleInputChange}
                className="input-base min-h-[100px] resize-y"
                placeholder="Escribe el mensaje que se enviará cuando se confirme una orden..."
              />
              {errors.orderConfirmationMessage && <FormError message={errors.orderConfirmationMessage} />}
              <p className="mt-2 text-xs text-gray-500">
                Este mensaje se envía a los clientes cuando confirman su orden.
              </p>
            </div>

            <div>
              <label htmlFor="orderReadyMessage" className="block text-sm font-semibold text-gray-700 mb-2">
                Mensaje de Orden Lista
              </label>
              <textarea
                id="orderReadyMessage"
                name="orderReadyMessage"
                rows={4}
                value={config.orderReadyMessage}
                onChange={handleInputChange}
                className="input-base min-h-[100px] resize-y"
                placeholder="Escribe el mensaje que se enviará cuando la orden esté lista..."
              />
              {errors.orderReadyMessage && <FormError message={errors.orderReadyMessage} />}
              <p className="mt-2 text-xs text-gray-500">
                Este mensaje se envía a los clientes cuando su orden está lista para recoger.
              </p>
            </div>
          </div>
        </div>

        {/* Template Variables Section */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Variables de Plantilla
              </h3>
              <p className="text-sm text-gray-600">
                Usa estas variables para personalizar automáticamente tus mensajes
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-800 mb-3">Variables Disponibles</h4>
                <p className="text-sm text-indigo-700 mb-4">
                  Puedes usar las siguientes variables en tus mensajes. Se reemplazarán automáticamente con la información real:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="bg-indigo-100 px-2 py-1 rounded text-xs font-mono text-indigo-800">
                        {'{cliente_nombre}'}
                      </code>
                      <span className="text-xs text-indigo-700">- Nombre del cliente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-indigo-100 px-2 py-1 rounded text-xs font-mono text-indigo-800">
                        {'{numero_orden}'}
                      </code>
                      <span className="text-xs text-indigo-700">- Número de orden</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-indigo-100 px-2 py-1 rounded text-xs font-mono text-indigo-800">
                        {'{fecha_orden}'}
                      </code>
                      <span className="text-xs text-indigo-700">- Fecha de la orden</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="bg-indigo-100 px-2 py-1 rounded text-xs font-mono text-indigo-800">
                        {'{tienda_nombre}'}
                      </code>
                      <span className="text-xs text-indigo-700">- Nombre de la tienda</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-indigo-100 px-2 py-1 rounded text-xs font-mono text-indigo-800">
                        {'{tienda_telefono}'}
                      </code>
                      <span className="text-xs text-indigo-700">- Teléfono de la tienda</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-indigo-100 px-2 py-1 rounded text-xs font-mono text-indigo-800">
                        {'{total_orden}'}
                      </code>
                      <span className="text-xs text-indigo-700">- Total de la orden</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className={getButtonClass('admin')}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Notificaciones'}
          </button>
        </div>
      </form>
    </BaseCard>
  );
};

export default NotificationsSettings;