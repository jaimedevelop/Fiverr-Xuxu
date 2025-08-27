import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit, Trash2, Check, X, Save, Smartphone, Building2, Wallet, DollarSign } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'cash':
        return <DollarSign className="h-5 w-5" />;
      case 'bank_transfer':
        return <Building2 className="h-5 w-5" />;
      case 'digital_wallet':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Wallet className="h-5 w-5" />;
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-600' };
      case 'cash':
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: 'text-emerald-600' };
      case 'bank_transfer':
        return { bg: 'bg-purple-100', text: 'text-purple-800', icon: 'text-purple-600' };
      case 'digital_wallet':
        return { bg: 'bg-pink-100', text: 'text-pink-800', icon: 'text-pink-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' };
    }
  };

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
      <div className="space-y-6">
        {/* Header */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-saffron rounded-xl flex items-center justify-center shadow-brand-lg">
                <CreditCard className="w-6 h-6 text-orange-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMethod ? 'Editar Método de Pago' : 'Agregar Método de Pago'}
                </h2>
                <p className="text-gray-600">
                  {editingMethod ? 'Actualiza la configuración del método' : 'Configura un nuevo método de pago para los clientes'}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className={getButtonClass('outline')}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </button>
          </div>
        </div>

        <BaseCard title="Configuración del Método">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Método
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                    placeholder="Ej: Tarjeta de Crédito Visa"
                  />
                </div>
                {errors.name && <FormError message={errors.name} />}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Pago
                </label>
                <Select
                  id="type"
                  name="type"
                  value={formData.type || 'credit_card'}
                  onChange={handleSelectChange}
                  options={paymentTypeOptions}
                  className="input-base"
                />
              </div>

              {(formData.type === 'credit_card' || formData.type === 'digital_wallet') && (
                <>
                  <div>
                    <label htmlFor="provider" className="block text-sm font-semibold text-gray-700 mb-2">
                      Proveedor
                    </label>
                    <Select
                      id="provider"
                      name="provider"
                      value={formData.config?.provider || ''}
                      onChange={handleSelectChange}
                      options={providerOptions}
                      className="input-base"
                    />
                    {errors.provider && <FormError message={errors.provider} />}
                  </div>

                  <div>
                    <label htmlFor="publicKey" className="block text-sm font-semibold text-gray-700 mb-2">
                      Clave Pública
                    </label>
                    <Input
                      id="publicKey"
                      name="publicKey"
                      value={formData.config?.publicKey || ''}
                      onChange={handleConfigChange}
                      className="input-base"
                      placeholder="pk_test_..."
                    />
                    {errors.publicKey && <FormError message={errors.publicKey} />}
                    <p className="text-xs text-gray-500 mt-1">
                      Clave pública proporcionada por el proveedor de pagos
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-emerald-900">
                Habilitar método de pago
              </label>
              <p className="text-xs text-emerald-700 ml-auto">
                Los clientes podrán usar este método si está activo
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className={getButtonClass('outline')}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={getButtonClass('admin')}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Guardando...' : (editingMethod ? 'Actualizar' : 'Guardar')}
              </button>
            </div>
          </form>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-saffron rounded-xl flex items-center justify-center shadow-brand-lg">
              <CreditCard className="w-6 h-6 text-orange-900" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Métodos de Pago</h2>
              <p className="text-gray-600">
                Gestiona los métodos de pago disponibles para tus clientes
              </p>
            </div>
          </div>
          
          <button
            onClick={handleAddMethod}
            className={getButtonClass('primary')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Método
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card-base p-4 bg-red-50 border-red-200 border">
          <FormError message={error} />
        </div>
      )}

      {/* Payment Methods List */}
      <BaseCard>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 bg-gradient-saffron rounded-full flex items-center justify-center animate-pulse">
              <CreditCard className="w-6 h-6 text-orange-900" />
            </div>
            <p className="text-gray-600 font-medium ml-4">Cargando métodos de pago...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay métodos de pago configurados</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Agrega métodos de pago para que tus clientes puedan realizar compras fácilmente.
                </p>
                <button
                  onClick={handleAddMethod}
                  className={getButtonClass('primary')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Método
                </button>
              </div>
            ) : (
              paymentMethods.map((method) => {
                const colors = getPaymentTypeColor(method.type);
                return (
                  <div key={method.id} className="card-base p-6 hover:shadow-brand-xl transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                          <div className={colors.icon}>
                            {getPaymentIcon(method.type)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                              {getPaymentTypeLabel(method.type)}
                            </span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-600">
                              {getProviderLabel(method.config?.provider)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${method.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                          <span className={`text-sm font-medium ${method.isActive ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {method.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(method.id, !method.isActive)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                              method.isActive 
                                ? 'bg-amber-100 hover:bg-amber-200' 
                                : 'bg-emerald-100 hover:bg-emerald-200'
                            }`}
                            title={method.isActive ? 'Desactivar método' : 'Activar método'}
                          >
                            {method.isActive 
                              ? <X className="h-4 w-4 text-amber-600" /> 
                              : <Check className="h-4 w-4 text-emerald-600" />
                            }
                          </button>
                          
                          <button
                            onClick={() => handleEditMethod(method)}
                            className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                            title="Editar método"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteMethod(method.id)}
                            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                            title="Eliminar método"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Quick Stats */}
        {paymentMethods.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">Métodos Activos</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {paymentMethods.filter(m => m.isActive).length}
                  </p>
                </div>
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total de Métodos</p>
                  <p className="text-2xl font-bold text-blue-900">{paymentMethods.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Métodos Digitales</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {paymentMethods.filter(m => m.type === 'credit_card' || m.type === 'digital_wallet').length}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}
      </BaseCard>
    </div>
  );
};

export default PaymentMethods;