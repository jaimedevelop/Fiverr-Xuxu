// src/components/admin/settings/GeneralSettings.tsx - Theme Converted
import React, { useState, useEffect } from 'react';
import { Save, Settings, Globe, Store, MapPin, Phone, Mail } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
      storeName: 'Dulces Momentos',
      storeEmail: 'contacto@dulcesmomentos.mx',
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
                La configuración general se guardó correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Store Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-saffron-200">
            <div className="w-10 h-10 bg-gradient-saffron rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-orange-900" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Información de la Tienda
              </h3>
              <p className="text-sm text-gray-600">
                Configura los datos principales de tu negocio
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de la Tienda
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="storeName"
                  name="storeName"
                  value={config.storeName}
                  onChange={handleInputChange}
                  className="pl-10 input-base"
                />
              </div>
              {errors.storeName && <FormError message={errors.storeName} />}
            </div>

            <div>
              <label htmlFor="storeEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Email de la Tienda
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="storeEmail"
                  name="storeEmail"
                  type="email"
                  value={config.storeEmail}
                  onChange={handleInputChange}
                  className="pl-10 input-base"
                />
              </div>
              {errors.storeEmail && <FormError message={errors.storeEmail} />}
            </div>

            <div>
              <label htmlFor="storePhone" className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono de la Tienda
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="storePhone"
                  name="storePhone"
                  value={config.storePhone}
                  onChange={handleInputChange}
                  className="pl-10 input-base"
                />
              </div>
              {errors.storePhone && <FormError message={errors.storePhone} />}
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                Moneda
              </label>
              <Select
                id="currency"
                name="currency"
                value={config.currency}
                onChange={handleInputChange}
                options={currencyOptions}
                className="input-base"
              />
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-semibold text-gray-700 mb-2">
                Zona Horaria
              </label>
              <Select
                id="timezone"
                name="timezone"
                value={config.timezone}
                onChange={handleInputChange}
                options={timezoneOptions}
                className="input-base"
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                Idioma
              </label>
              <Select
                id="language"
                name="language"
                value={config.language}
                onChange={handleInputChange}
                options={languageOptions}
                className="input-base"
              />
            </div>
          </div>
        </div>

        {/* Business Hours Preview Section */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-10 h-10 bg-gradient-mint rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Horarios de Atención
              </h3>
              <p className="text-sm text-gray-600">
                Próximamente: configuración de horarios de negocio
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-mint-50 to-emerald-50 border border-mint-200 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-mint-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-emerald-800 mb-3">Próximamente: Gestión de Horarios</h4>
                <div className="space-y-3 text-sm text-emerald-700">
                  <p>
                    Esta sección estará disponible próximamente para configurar los horarios de atención 
                    de tu negocio, días de cierre, y horarios especiales para días festivos.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs">Horarios de lunes a domingo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs">Configuración de días festivos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs">Horarios especiales y excepciones</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs">Zonas de entrega por horario</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Features Section */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-10 h-10 bg-gradient-pink rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-pink-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Configuraciones Adicionales
              </h3>
              <p className="text-sm text-gray-600">
                Funciones avanzadas para personalizar tu experiencia
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-base p-4 hover:shadow-brand-xl transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📍</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Información de Ubicación
                  </h4>
                  <p className="text-xs text-gray-600">
                    Configura la dirección de tu negocio, zonas de entrega y opciones de delivery.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-base p-4 hover:shadow-brand-xl transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💳</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Métodos de Pago
                  </h4>
                  <p className="text-xs text-gray-600">
                    Gestiona los métodos de pago aceptados y configuración de pasarelas.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-base p-4 hover:shadow-brand-xl transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🏪</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Información Pública
                  </h4>
                  <p className="text-xs text-gray-600">
                    Edita la información que ven los clientes: descripción, fotos, especialidades.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-base p-4 hover:shadow-brand-xl transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">
                    Integración con Redes
                  </h4>
                  <p className="text-xs text-gray-600">
                    Conecta tus redes sociales y configura opciones de marketing digital.
                  </p>
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
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </BaseCard>
  );
};

export default GeneralSettings;