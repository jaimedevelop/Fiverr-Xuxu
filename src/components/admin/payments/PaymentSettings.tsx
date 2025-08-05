import React, { useState, useEffect } from 'react';
import { Settings, Save, CreditCard, Shield, Info } from 'lucide-react';
import Button from '../../../components/ui/Button';
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
    
    if (validateForm()) {
      // In a real app, this would save the settings to the API
      console.log('Saving payment settings:', config);
      alert('Configuración guardada correctamente');
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
    <BaseCard title="Configuración de Pagos">
      {error && <div className="mb-6"><FormError message={error} /></div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
            Configuración General
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <Select
                id="currency"
                name="currency"
                value={config.currency}
                onChange={handleSelectChange}
                options={currencyOptions}
                className="w-full"
              />
              {errors.currency && <FormError message={errors.currency} />}
            </div>

            <div>
              <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700 mb-1">
                Pasarela de Pago
              </label>
              <Select
                id="paymentGateway"
                name="paymentGateway"
                value={config.paymentGateway}
                onChange={handleSelectChange}
                options={gatewayOptions}
                className="w-full"
              />
              {errors.paymentGateway && <FormError message={errors.paymentGateway} />}
            </div>

            <div>
              <label htmlFor="minPaymentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Monto Mínimo de Pago
              </label>
              <Input
                id="minPaymentAmount"
                name="minPaymentAmount"
                type="number"
                min="0"
                value={config.minPaymentAmount}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.minPaymentAmount && <FormError message={errors.minPaymentAmount} />}
            </div>

            <div>
              <label htmlFor="maxPaymentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Monto Máximo de Pago
              </label>
              <Input
                id="maxPaymentAmount"
                name="maxPaymentAmount"
                type="number"
                min="0"
                value={config.maxPaymentAmount}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.maxPaymentAmount && <FormError message={errors.maxPaymentAmount} />}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            Seguridad y Verificación
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center">
                <input
                  id="testMode"
                  name="testMode"
                  type="checkbox"
                  checked={config.testMode}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="testMode" className="ml-2 block text-sm text-gray-900">
                  Modo de Prueba
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Las transacciones se procesarán en modo de prueba sin cobrar a los clientes.
              </p>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="requireVerification"
                  name="requireVerification"
                  type="checkbox"
                  checked={config.requireVerification}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requireVerification" className="ml-2 block text-sm text-gray-900">
                  Requerir Verificación
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Los usuarios deberán verificar su identidad antes de realizar pagos.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-500" />
            Opciones Avanzadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center">
                <input
                  id="allowPartialPayments"
                  name="allowPartialPayments"
                  type="checkbox"
                  checked={config.allowPartialPayments}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="allowPartialPayments" className="ml-2 block text-sm text-gray-900">
                  Permitir Pagos Parciales
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Permite a los clientes pagar una parte del total de la orden.
              </p>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="autoRefundEnabled"
                  name="autoRefundEnabled"
                  type="checkbox"
                  checked={config.autoRefundEnabled}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoRefundEnabled" className="ml-2 block text-sm text-gray-900">
                  Reembolsos Automáticos
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Procesa automáticamente las solicitudes de reembolso.
              </p>
            </div>

            <div>
              <label htmlFor="refundWindowDays" className="block text-sm font-medium text-gray-700 mb-1">
                Período de Reembolso (días)
              </label>
              <Input
                id="refundWindowDays"
                name="refundWindowDays"
                type="number"
                min="1"
                value={config.refundWindowDays}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.refundWindowDays && <FormError message={errors.refundWindowDays} />}
              <p className="mt-1 text-xs text-gray-500">
                Los clientes pueden solicitar reembolsos dentro de este período.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Información Importante</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Los cambios en la configuración de pagos pueden afectar las transacciones en curso.
                  Asegúrate de guardar una copia de seguridad de tu configuración actual antes de realizar cambios.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </form>
    </BaseCard>
  );
};

export default PaymentSettings;