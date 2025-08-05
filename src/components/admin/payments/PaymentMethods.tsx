import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit, Trash2, Check, X, Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import BaseCard from '../../../components/common/BaseCard';
import FormError from '../../../components/common/FormError';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'digital_wallet';
  isActive: boolean;
  config?: {
    provider?: string;
    apiKey?: string;
    publicKey?: string;
    merchantId?: string;
  };
}

interface PaymentMethodsProps {
  loading?: boolean;
  error?: string | null;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  loading = false, 
  error = null 
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: '',
    type: 'credit_card',
    isActive: true,
    config: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Mock data for development
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        name: 'Tarjeta de Crédito',
        type: 'credit_card',
        isActive: true,
        config: {
          provider: 'Stripe',
          publicKey: 'pk_test_123456'
        }
      },
      {
        id: '2',
        name: 'Efectivo',
        type: 'cash',
        isActive: true
      },
      {
        id: '3',
        name: 'Transferencia Bancaria',
        type: 'bank_transfer',
        isActive: true,
        config: {
          provider: 'Bank',
          merchantId: 'merchant123'
        }
      }
    ];
    setPaymentMethods(mockPaymentMethods);
  }, []);

  const paymentTypeOptions = [
    { value: 'credit_card', label: 'Tarjeta de Crédito' },
    { value: 'debit_card', label: 'Tarjeta de Débito' },
    { value: 'cash', label: 'Efectivo' },
    { value: 'bank_transfer', label: 'Transferencia Bancaria' },
    { value: 'digital_wallet', label: 'Billetera Digital' },
  ];

  const providerOptions = [
    { value: 'stripe', label: 'Stripe' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'mercado_pago', label: 'Mercado Pago' },
    { value: 'bank', label: 'Transferencia Bancaria' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre del método de pago es requerido';
    }
    
    if (formData.type === 'credit_card' || formData.type === 'digital_wallet') {
      if (!formData.config?.provider) {
        newErrors.provider = 'El proveedor es requerido para este tipo de pago';
      }
      
      if (!formData.config?.publicKey) {
        newErrors.publicKey = 'La clave pública es requerida para este tipo de pago';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editingMethod) {
        // Update existing payment method
        setPaymentMethods(prev => 
          prev.map(method => 
            method.id === editingMethod.id 
              ? { ...method, ...formData } as PaymentMethod 
              : method
          )
        );
      } else {
        // Add new payment method
        const newMethod: PaymentMethod = {
          id: `payment-${Date.now()}`,
          name: formData.name || '',
          type: formData.type || 'credit_card',
          isActive: formData.isActive || true,
          config: formData.config || {}
        };
        setPaymentMethods(prev => [...prev, newMethod]);
      }
      
      setIsFormVisible(false);
      setEditingMethod(null);
      setFormData({
        name: '',
        type: 'credit_card',
        isActive: true,
        config: {}
      });
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isActive') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
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

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: value
      }
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

  const handleAddMethod = () => {
    setEditingMethod(null);
    setIsFormVisible(true);
    setFormData({
      name: '',
      type: 'credit_card',
      isActive: true,
      config: {}
    });
    setErrors({});
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsFormVisible(true);
    setFormData(method);
    setErrors({});
  };

  const handleDeleteMethod = (methodId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    }
  };

  const handleToggleActive = (methodId: string, isActive: boolean) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, isActive } 
          : method
      )
    );
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingMethod(null);
    setFormData({
      name: '',
      type: 'credit_card',
      isActive: true,
      config: {}
    });
    setErrors({});
  };

  const getPaymentTypeLabel = (type: string) => {
    const option = paymentTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  const getProviderLabel = (provider?: string) => {
    if (!provider) return 'N/A';
    const option = providerOptions.find(opt => opt.value === provider);
    return option ? option.label : provider;
  };

  if (isFormVisible) {
    return (
      <BaseCard title={editingMethod ? 'Editar Método de Pago' : 'Agregar Método de Pago'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Método
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.name && <FormError message={errors.name} />}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pago
              </label>
              <Select
                id="type"
                name="type"
                value={formData.type || 'credit_card'}
                onChange={handleSelectChange}
                options={paymentTypeOptions}
                className="w-full"
              />
            </div>

            {(formData.type === 'credit_card' || formData.type === 'digital_wallet') && (
              <>
                <div>
                  <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <Select
                    id="provider"
                    name="provider"
                    value={formData.config?.provider || ''}
                    onChange={handleSelectChange}
                    options={providerOptions}
                    className="w-full"
                  />
                  {errors.provider && <FormError message={errors.provider} />}
                </div>

                <div>
                  <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700 mb-1">
                    Clave Pública
                  </label>
                  <Input
                    id="publicKey"
                    name="publicKey"
                    value={formData.config?.publicKey || ''}
                    onChange={handleConfigChange}
                    className="w-full"
                  />
                  {errors.publicKey && <FormError message={errors.publicKey} />}
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Método activo
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Métodos de Pago">
      {error && <div className="mb-6"><FormError message={error} /></div>}
      
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddMethod}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Método
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <CreditCard className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay métodos de pago</h3>
              <p className="text-gray-500 mb-4">
                Agrega métodos de pago para que tus clientes puedan realizar compras.
              </p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md mr-4 ${
                      method.type === 'credit_card' || method.type === 'debit_card' 
                        ? 'bg-blue-100 text-blue-600' 
                        : method.type === 'cash'
                        ? 'bg-green-100 text-green-600'
                        : method.type === 'bank_transfer'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{method.name}</h3>
                      <p className="text-xs text-gray-500">
                        {getPaymentTypeLabel(method.type)} - {getProviderLabel(method.config?.provider)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className={`inline-flex h-2 w-2 rounded-full mr-2 ${
                        method.isActive ? 'bg-green-400' : 'bg-gray-300'
                      }`}></span>
                      <span className="text-xs text-gray-500">
                        {method.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleToggleActive(method.id, !method.isActive)}
                      className="h-8 w-8 p-0"
                    >
                      {method.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleEditMethod(method)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteMethod(method.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </BaseCard>
  );
};

export default PaymentMethods;