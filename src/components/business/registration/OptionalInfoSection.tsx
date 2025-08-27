// src/components/business/registration/OptionalInfoSection.tsx - Enhanced with Order Settings
import React, { useState } from 'react';
import { Upload, Clock, Settings, Info } from 'lucide-react';
import Input from '../../common/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';
import OperatingHoursInput from '../../operatingHours/OperatingHoursInput';
import type { BusinessRegistrationData } from '../../../types/business';
import { OrderSettings, DEFAULT_ORDER_SETTINGS } from '../../../utils/orderScheduler';

interface OptionalInfoSectionProps {
  formData: BusinessRegistrationData;
  setFormData: React.Dispatch<React.SetStateAction<BusinessRegistrationData>>;
}

const OptionalInfoSection: React.FC<OptionalInfoSectionProps> = ({
  formData,
  setFormData
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'hours' | 'orders'>('basic');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Initialize order settings if not present
  const orderSettings = formData.orderSettings || DEFAULT_ORDER_SETTINGS;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOperatingHoursChange = (operatingHours: any) => {
    setFormData(prev => ({ ...prev, operatingHours }));
  };

  const handleOrderSettingsChange = (field: keyof OrderSettings, value: any) => {
    const updatedOrderSettings = {
      ...orderSettings,
      [field]: value
    };
    
    setFormData(prev => ({ 
      ...prev, 
      orderSettings: updatedOrderSettings 
    }));
  };

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
    { value: '20:00', label: '8:00 PM' }
  ];

  const delayOptions = [
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '60', label: '1 hora' },
    { value: '90', label: '1.5 horas' },
    { value: '120', label: '2 horas' },
    { value: '150', label: '2.5 horas' },
    { value: '180', label: '3 horas' }
  ];

  const tabs = [
    { id: 'basic' as const, name: 'Información Básica', icon: Upload },
    { id: 'hours' as const, name: 'Horarios', icon: Clock },
    { id: 'orders' as const, name: 'Configuración de Pedidos', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Logo del Negocio</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                    Subir Logo (Opcional)
                  </label>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF hasta 10MB. Recomendado: 200x200px
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Información Opcional</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Esta información es opcional pero recomendada. Puedes configurar tu logo, 
                  horarios de operación y reglas de pedidos ahora o hacerlo más tarde desde 
                  la configuración de tu cuenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operating Hours Tab */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Horarios de Operación</h3>
            <p className="text-sm text-gray-600 mb-6">
              Configura los horarios en que tu negocio está abierto. Estos horarios se usarán 
              para calcular los tiempos de entrega y disponibilidad de pedidos.
            </p>
          </div>

          <OperatingHoursInput
            operatingHours={formData.operatingHours}
            onChange={handleOperatingHoursChange}
          />

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <Clock className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-amber-800">Nota sobre Horarios</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Los horarios que configures aquí se usarán para determinar cuándo los clientes 
                  pueden hacer pedidos y cuándo estarán listos. Puedes modificarlos en cualquier 
                  momento desde tu panel de administración.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Settings Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración de Pedidos</h3>
            <p className="text-sm text-gray-600 mb-6">
              Configura cómo se manejan los pedidos según el horario en que los clientes los realizan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cutoffTime" className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Corte para Siguiente Día
              </label>
              <Select
                id="cutoffTime"
                name="cutoffTime"
                value={orderSettings.cutoffTime}
                onChange={(e) => handleOrderSettingsChange('cutoffTime', e.target.value)}
                options={timeOptions}
                className="w-full"
              />
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
                value={orderSettings.morningOrderDeadline}
                onChange={(e) => handleOrderSettingsChange('morningOrderDeadline', e.target.value)}
                options={timeOptions}
                className="w-full"
              />
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
                value={orderSettings.sameDayCompletionHour}
                onChange={(e) => handleOrderSettingsChange('sameDayCompletionHour', e.target.value)}
                options={timeOptions}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Pedidos prioritarios listos hasta esta hora
              </p>
            </div>

            <div>
              <label htmlFor="defaultQueueDelay" className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Procesamiento Estándar
              </label>
              <Select
                id="defaultQueueDelay"
                name="defaultQueueDelay"
                value={orderSettings.defaultQueueDelay.toString()}
                onChange={(e) => handleOrderSettingsChange('defaultQueueDelay', parseInt(e.target.value))}
                options={delayOptions}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Tiempo estimado para completar un pedido
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="enableOrderQueue"
                name="enableOrderQueue"
                type="checkbox"
                checked={orderSettings.enableOrderQueue}
                onChange={(e) => handleOrderSettingsChange('enableOrderQueue', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableOrderQueue" className="ml-2 block text-sm text-gray-900">
                Habilitar Cola de Pedidos
              </label>
            </div>
            <p className="text-xs text-gray-500 ml-6">
              Permite que los clientes hagan pedidos incluso cuando estás cerrado
            </p>
          </div>

          {/* Order Logic Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Vista Previa de la Lógica</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Pedidos después de las <strong>{orderSettings.cutoffTime}</strong> se programan para el siguiente día
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Pedidos entre las 9:00 AM y <strong>{orderSettings.morningOrderDeadline}</strong> tienen prioridad 
                y pueden estar listos hasta las <strong>{orderSettings.sameDayCompletionHour}</strong>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Tiempo estándar de procesamiento: <strong>{orderSettings.defaultQueueDelay} minutos</strong>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                Pedidos fuera de horario: {orderSettings.enableOrderQueue ? 'Se agregan a la cola' : 'No permitidos'}
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <Settings className="h-5 w-5 text-green-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">Configuración Inteligente</h4>
                <p className="text-sm text-green-700 mt-1">
                  Estas configuraciones te ayudarán a manejar los pedidos de manera eficiente. 
                  Los valores predeterminados están optimizados para la mayoría de pastelerías, 
                  pero puedes ajustarlos según tus necesidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionalInfoSection;