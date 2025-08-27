import React, { useState, useEffect } from 'react';
import { Settings, Save, CreditCard, Shield, Info, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';

interface PaymentSettingsProps {
  loading?: boolean;
  error?: string | null;
}

interface PaymentConfig {
  currency: string;
  paymentGateway: string;
  testMode: boolean;
  requireVerification: boolean;
  allowPartialPayments: boolean;
  autoRefundEnabled: boolean;
  refundWindowDays: number;
  minPaymentAmount: number;
  maxPaymentAmount: number;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ 
  loading = false, 
  error = null 
}) => {
  const [config, setConfig] = useState<PaymentConfig>({
    currency: 'MXN',
    paymentGateway: 'stripe',
    testMode: true,
    requireVerification: true,
    allowPartialPayments: false,
    autoRefundEnabled: false,
    refundWindowDays: 7,
    minPaymentAmount: 10,
    maxPaymentAmount: 50000,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch the settings from the API
    // For now, we'll use the default values
  }, []);

  const currencyOptions = [
    { value: 'MXN', label: 'Peso Mexicano (MXN)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
  ];

  const gatewayOptions = [
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'mercado_pago', label: 'Mercado Pago' },
    { value: 'conekta', label: 'Conekta' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!config.currency) {
      newErrors.currency = 'La moneda es requerida';
    }
    
    if (!config.paymentGateway) {
      newErrors.paymentGateway = 'El pasarela de pago es requerida';
    }
    
    if (config.minPaymentAmount <= 0) {
      newErrors.minPaymentAmount = 'El monto mínimo debe ser mayor que cero';
    }
    
    if (config.maxPaymentAmount <= 0) {
      newErrors.maxPaymentAmount = 'El monto máximo debe ser mayor que cero';
    }
    
    if (config.minPaymentAmount >= config.maxPaymentAmount) {
      newErrors.minPaymentAmount = 'El monto mínimo debe ser menor que el monto máximo';
    }
    
    if (config.refundWindowDays <= 0) {
      newErrors.refundWindowDays = 'El período de reembolso debe ser mayor que cero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    if (validateForm()) {
      // In a real app, this would save the settings to the API
      console.log('Saving payment settings:', config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setConfig(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [name]: name.includes('Amount') || name.includes('Days') ? Number(value) : value
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="card-base p-4 bg-red-50 border-red-200 border">
          <FormError message={error} />
        </div>
      )}

      {/* Success Display */}
      {saveSuccess && (
        <div className="card-base p-4 bg-emerald-50 border-emerald-200 border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Save className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-800">¡Configuración Guardada!</h3>
              <p className="text-sm text-emerald-700">
                Los ajustes de pago se han actualizado correctamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Configuration */}
        <BaseCard title="Configuración General">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-saffron-200">
              <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-orange-900" />
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  Configuración Básica
                </h3>
                <p className="text-sm text-gray-600">
                  Ajustes principales para el procesamiento de pagos
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                  Moneda Principal
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select
                    id="currency"
                    name="currency"
                    value={config.currency}
                    onChange={handleSelectChange}
                    options={currencyOptions}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.currency && <FormError message={errors.currency} />}
              </div>

              <div>
                <label htmlFor="paymentGateway" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pasarela de Pago
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Select
                    id="paymentGateway"
                    name="paymentGateway"
                    value={config.paymentGateway}
                    onChange={handleSelectChange}
                    options={gatewayOptions}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.paymentGateway && <FormError message={errors.paymentGateway} />}
              </div>

              <div>
                <label htmlFor="minPaymentAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Monto Mínimo (MXN)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="minPaymentAmount"
                    name="minPaymentAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={config.minPaymentAmount}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.minPaymentAmount && <FormError message={errors.minPaymentAmount} />}
              </div>

              <div>
                <label htmlFor="maxPaymentAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                  Monto Máximo (MXN)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="maxPaymentAmount"
                    name="maxPaymentAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={config.maxPaymentAmount}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.maxPaymentAmount && <FormError message={errors.maxPaymentAmount} />}
              </div>
            </div>
          </div>
        </BaseCard>

        {/* Security Configuration */}
        <BaseCard title="Seguridad y Verificación">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-emerald-200">
              <div className="w-8 h-8 bg-gradient-mint rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  Configuración de Seguridad
                </h3>
                <p className="text-sm text-gray-600">
                  Ajustes para proteger las transacciones
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-base p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        id="testMode"
                        name="testMode"
                        type="checkbox"
                        checked={config.testMode}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="testMode" className="ml-3 block text-sm font-semibold text-gray-900">
                        Modo de Prueba
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Las transacciones se procesarán sin cobrar a los clientes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-base p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        id="requireVerification"
                        name="requireVerification"
                        type="checkbox"
                        checked={config.requireVerification}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requireVerification" className="ml-3 block text-sm font-semibold text-gray-900">
                        Requerir Verificación
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Los usuarios verificarán su identidad antes de pagar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        {/* Advanced Options */}
        <BaseCard title="Opciones Avanzadas">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-purple-200">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  Configuración Avanzada
                </h3>
                <p className="text-sm text-gray-600">
                  Opciones adicionales para pagos y reembolsos
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-base p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        id="allowPartialPayments"
                        name="allowPartialPayments"
                        type="checkbox"
                        checked={config.allowPartialPayments}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowPartialPayments" className="ml-3 block text-sm font-semibold text-gray-900">
                        Permitir Pagos Parciales
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Los clientes pueden pagar parte del total de la orden.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-base p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        id="autoRefundEnabled"
                        name="autoRefundEnabled"
                        type="checkbox"
                        checked={config.autoRefundEnabled}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoRefundEnabled" className="ml-3 block text-sm font-semibold text-gray-900">
                        Reembolsos Automáticos
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Procesa automáticamente solicitudes de reembolso.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="refundWindowDays" className="block text-sm font-semibold text-gray-700 mb-2">
                  Período de Reembolso (días)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="refundWindowDays"
                    name="refundWindowDays"
                    type="number"
                    min="1"
                    value={config.refundWindowDays}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.refundWindowDays && <FormError message={errors.refundWindowDays} />}
                <p className="mt-1 text-xs text-gray-500">
                  Tiempo límite para solicitar reembolsos
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        {/* Important Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Información Importante</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  Los cambios en la configuración de pagos pueden afectar las transacciones en curso.
                  Te recomendamos hacer una copia de seguridad de tu configuración actual.
                </p>
                <ul className="list-disc list-inside space-y-1 mt-3">
                  <li>El modo de prueba evita cobros reales a los clientes</li>
                  <li>Los límites de monto ayudan a prevenir fraudes</li>
                  <li>La verificación adicional aumenta la seguridad</li>
                  <li>Los reembolsos automáticos mejoran la experiencia del cliente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="card-base p-6">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={getButtonClass('admin')}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentSettings;