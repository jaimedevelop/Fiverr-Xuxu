// src/components/admin/settings/GeneralSettings.tsx - Simplified (for future general settings)
import React, { useState, useEffect } from 'react';
import { Save, Settings, Globe } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';

interface GeneralSettingsProps {
  loading?: boolean;
  error?: string | null;
}

interface GeneralConfig {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  timezone: string;
  language: string;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  loading = false,
  error = null
}) => {
  const [config, setConfig] = useState<GeneralConfig>({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    language: 'es'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Mock data for development - In real app, fetch from API
    setConfig({
      storeName: 'Pastelería Delicias',
      storeEmail: 'contacto@pasteleriadelicias.com',
      storePhone: '+52 55 1234 5678',
      currency: 'MXN',
      timezone: 'America/Mexico_City',
      language: 'es'
    });
  }, []);

  const currencyOptions = [
    { value: 'MXN', label: 'Peso Mexicano (MXN)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
  ];

  const timezoneOptions = [
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/Monterrey', label: 'Monterrey (GMT-6)' },
    { value: 'America/Guadalajara', label: 'Guadalajara (GMT-6)' },
    { value: 'America/Cancun', label: 'Cancún (GMT-5)' },
  ];

  const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!config.storeName?.trim()) {
      newErrors.storeName = 'El nombre de la tienda es requerido';
    }

    if (!config.storeEmail?.trim()) {
      newErrors.storeEmail = 'El email de la tienda es requerido';
    } else if (!/\S+@\S+\.\S+/.test(config.storeEmail)) {
      newErrors.storeEmail = 'El email no es válido';
    }

    if (!config.storePhone?.trim()) {
      newErrors.storePhone = 'El teléfono de la tienda es requerido';
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
      console.log('Saving general settings:', config);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving general settings:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setConfig(prev => ({
      ...prev,
      [name]: value
    }));

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
    <BaseCard title="Configuración General">
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
                La configuración general se guardó correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            Información de la Tienda
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Tienda
              </label>
              <Input
                id="storeName"
                name="storeName"
                value={config.storeName}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.storeName && <FormError message={errors.storeName} />}
            </div>

            <div>
              <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email de la Tienda
              </label>
              <Input
                id="storeEmail"
                name="storeEmail"
                type="email"
                value={config.storeEmail}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.storeEmail && <FormError message={errors.storeEmail} />}
            </div>

            <div>
              <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono de la Tienda
              </label>
              <Input
                id="storePhone"
                name="storePhone"
                value={config.storePhone}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.storePhone && <FormError message={errors.storePhone} />}
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <Select
                id="currency"
                name="currency"
                value={config.currency}
                onChange={handleInputChange}
                options={currencyOptions}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                Zona Horaria
              </label>
              <Select
                id="timezone"
                name="timezone"
                value={config.timezone}
                onChange={handleInputChange}
                options={timezoneOptions}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Idioma
              </label>
              <Select
                id="language"
                name="language"
                value={config.language}
                onChange={handleInputChange}
                options={languageOptions}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Business Hours Section */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-green-500" />
            Horarios de Atención
          </h3>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Configuración de Horarios</h4>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Esta sección estará disponible próximamente. Aquí podrás configurar los horarios de atención 
                    de tu negocio, días de cierre, y horarios especiales para días festivos.
                  </p>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center text-blue-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-xs">Horarios de lunes a domingo</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-xs">Configuración de días festivos</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-xs">Horarios especiales y excepciones</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings Section */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-500" />
            Configuraciones Adicionales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                📍 Información de Ubicación
              </h4>
              <p className="text-sm text-green-700">
                Configura la dirección de tu negocio, zonas de entrega y opciones de delivery.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-amber-800 mb-2">
                💳 Métodos de Pago
              </h4>
              <p className="text-sm text-amber-700">
                Gestiona los métodos de pago aceptados y configuración de pasarelas de pago.
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-purple-800 mb-2">
                🏪 Información Pública
              </h4>
              <p className="text-sm text-purple-700">
                Edita la información que ven los clientes: descripción, fotos, especialidades.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                📱 Integración con Redes
              </h4>
              <p className="text-sm text-blue-700">
                Conecta tus redes sociales y configura opciones de marketing digital.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </form>
    </BaseCard>
  );
};

export default GeneralSettings;