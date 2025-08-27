import React, { useState, useEffect } from 'react';
import { Save, X, Tag, Calendar, Percent, DollarSign, Gift, Truck, Hash } from 'lucide-react';
import { getButtonClass, colors } from '../../../utils/themeHelper';
import BaseCard from '../../../components/common/BaseCard';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';
import { Pastry } from '../../../types/pastry';

interface Promotion {
  id?: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'free_shipping';
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  applicableItems: string[];
  code?: string;
}

interface PromotionFormProps {
  promotion?: Promotion | null;
  onSave: (promotion: Promotion) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ 
  promotion = null, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<Partial<Promotion>>({
    title: '',
    description: '',
    type: 'percentage',
    value: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isActive: true,
    usageLimit: 100,
    usedCount: 0,
    applicableItems: [],
    code: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pastries, setPastries] = useState<Pastry[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    // Mock data for development
    const mockPastries: Pastry[] = [
      {
        id: 'item1',
        name: 'Pastel de Chocolate',
        description: 'Delicioso pastel de chocolate',
        price: 250,
        categoryId: 'cat1',
        images: ['https://via.placeholder.com/150'],
        available: true,
        availabilityMode: 'inventory',
        inventory: 10,
        tags: ['chocolate', 'pastel'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item2',
        name: 'Pastel de Vainilla',
        description: 'Delicioso pastel de vainilla',
        price: 230,
        categoryId: 'cat1',
        images: ['https://via.placeholder.com/150'],
        available: true,
        availabilityMode: 'inventory',
        inventory: 15,
        tags: ['vainilla', 'pastel'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item3',
        name: 'Pastel de Fresa',
        description: 'Delicioso pastel de fresa',
        price: 260,
        categoryId: 'cat1',
        images: ['https://via.placeholder.com/150'],
        available: true,
        availabilityMode: 'inventory',
        inventory: 8,
        tags: ['fresa', 'pastel'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item4',
        name: 'Cupcake de Chocolate',
        description: 'Delicioso cupcake de chocolate',
        price: 35,
        categoryId: 'cat2',
        images: ['https://via.placeholder.com/150'],
        available: true,
        availabilityMode: 'inventory',
        inventory: 20,
        tags: ['chocolate', 'cupcake'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item5',
        name: 'Cupcake de Vainilla',
        description: 'Delicioso cupcake de vainilla',
        price: 30,
        categoryId: 'cat2',
        images: ['https://via.placeholder.com/150'],
        available: true,
        availabilityMode: 'inventory',
        inventory: 25,
        tags: ['vainilla', 'cupcake'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'item6',
        name: 'Galleta de Chispas',
        description: 'Deliciosa galleta con chispas de chocolate',
        price: 20,
        categoryId: 'cat3',
        images: ['https://via.placeholder.com/150'],
        available: true,
        availabilityMode: 'inventory',
        inventory: 30,
        tags: ['chispas', 'galleta'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setPastries(mockPastries);
  }, []);

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate)
      });
      setSelectedItems(promotion.applicableItems || []);
    }
  }, [promotion]);

  const promotionTypeOptions = [
    { value: 'percentage', label: 'Porcentaje de Descuento' },
    { value: 'fixed_amount', label: 'Monto Fijo de Descuento' },
    { value: 'buy_one_get_one', label: 'Compra uno, llévate otro (2x1)' },
    { value: 'free_shipping', label: 'Envío Gratis' },
  ];

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-5 h-5" />;
      case 'fixed_amount':
        return <DollarSign className="w-5 h-5" />;
      case 'buy_one_get_one':
        return <Gift className="w-5 h-5" />;
      case 'free_shipping':
        return <Truck className="w-5 h-5" />;
      default:
        return <Tag className="w-5 h-5" />;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'El título de la promoción es requerido';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'La descripción de la promoción es requerida';
    }
    
    if (formData.value === undefined || formData.value === null) {
      newErrors.value = 'El valor de la promoción es requerido';
    } else if (formData.type === 'percentage' && (formData.value < 0 || formData.value > 100)) {
      newErrors.value = 'El porcentaje debe estar entre 0 y 100';
    } else if (formData.type === 'fixed_amount' && formData.value < 0) {
      newErrors.value = 'El monto fijo debe ser mayor o igual a cero';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    if (formData.usageLimit === undefined || formData.usageLimit === null || formData.usageLimit <= 0) {
      newErrors.usageLimit = 'El límite de uso debe ser mayor que cero';
    }
    
    if (formData.type === 'free_shipping' && formData.value === 0) {
      newErrors.value = 'El monto mínimo para envío gratis debe ser mayor que cero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const promotionData: Promotion = {
        id: formData.id || `promotion-${Date.now()}`,
        title: formData.title || '',
        description: formData.description || '',
        type: formData.type || 'percentage',
        value: formData.value || 0,
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || new Date(),
        isActive: formData.isActive || true,
        usageLimit: formData.usageLimit || 100,
        usedCount: formData.usedCount || 0,
        applicableItems: selectedItems,
        code: formData.code
      };
      
      onSave(promotionData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'value') {
      setFormData(prev => ({
        ...prev,
        [name]: Number(value)
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: new Date(value)
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

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === pastries.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pastries.map(p => p.id));
    }
  };

  const getValueLabel = () => {
    switch (formData.type) {
      case 'percentage':
        return 'Porcentaje de Descuento (%)';
      case 'fixed_amount':
        return 'Monto de Descuento (MXN)';
      case 'buy_one_get_one':
        return 'No aplica';
      case 'free_shipping':
        return 'Monto Mínimo para Envío Gratis (MXN)';
      default:
        return 'Valor';
    }
  };

  const getValuePlaceholder = () => {
    switch (formData.type) {
      case 'percentage':
        return 'Ej: 20';
      case 'fixed_amount':
        return 'Ej: 50.00';
      case 'free_shipping':
        return 'Ej: 300.00';
      default:
        return 'Ingrese un valor';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-pink rounded-xl flex items-center justify-center shadow-brand-lg">
              <Tag className="w-6 h-6 text-pink-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {promotion ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>
              <p className="text-gray-600">
                {promotion ? 'Actualiza los detalles de la promoción' : 'Crea una nueva promoción para atraer clientes'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className={getButtonClass('outline')}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <BaseCard title="Información Básica">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-saffron-200">
              <div className="w-8 h-8 bg-gradient-saffron rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-orange-900" />
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  Detalles de la Promoción
                </h3>
                <p className="text-sm text-gray-600">
                  Define el nombre y tipo de promoción
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Título de la Promoción
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                    placeholder="Ej: Descuento de Verano"
                  />
                </div>
                {errors.title && <FormError message={errors.title} />}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Promoción
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {getPromotionIcon(formData.type || 'percentage')}
                  </div>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type || 'percentage'}
                    onChange={handleSelectChange}
                    options={promotionTypeOptions}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.type && <FormError message={errors.type} />}
              </div>

              <div>
                <label htmlFor="value" className="block text-sm font-semibold text-gray-700 mb-2">
                  {getValueLabel()}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {formData.type === 'percentage' && <Percent className="h-5 w-5" />}
                    {formData.type === 'fixed_amount' && <DollarSign className="h-5 w-5" />}
                    {formData.type === 'free_shipping' && <DollarSign className="h-5 w-5" />}
                    {formData.type === 'buy_one_get_one' && <Gift className="h-5 w-5" />}
                  </div>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    min="0"
                    step={formData.type === 'percentage' ? '1' : '0.01'}
                    value={formData.value || ''}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                    placeholder={getValuePlaceholder()}
                    disabled={formData.type === 'buy_one_get_one'}
                  />
                </div>
                {errors.value && <FormError message={errors.value} />}
                {formData.type === 'buy_one_get_one' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Para promociones 2x1 no se requiere valor específico
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                  Código de Promoción (Opcional)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="code"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                    placeholder="Ej: VERANO20"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Código que los clientes usarán para aplicar la promoción
                </p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-base min-h-[100px] resize-y"
                  placeholder="Describe los detalles de la promoción..."
                />
                {errors.description && <FormError message={errors.description} />}
              </div>
            </div>
          </div>
        </BaseCard>

        {/* Schedule & Limits */}
        <BaseCard title="Programación y Límites">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-emerald-200">
              <div className="w-8 h-8 bg-gradient-mint rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  Fechas y Límites de Uso
                </h3>
                <p className="text-sm text-gray-600">
                  Configura cuando será válida la promoción
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                    onChange={handleDateChange}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.startDate && <FormError message={errors.startDate} />}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                    onChange={handleDateChange}
                    className="pl-10 input-base"
                  />
                </div>
                {errors.endDate && <FormError message={errors.endDate} />}
              </div>

              <div>
                <label htmlFor="usageLimit" className="block text-sm font-semibold text-gray-700 mb-2">
                  Límite de Uso
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    min="1"
                    value={formData.usageLimit || ''}
                    onChange={handleInputChange}
                    className="pl-10 input-base"
                    placeholder="100"
                  />
                </div>
                {errors.usageLimit && <FormError message={errors.usageLimit} />}
                <p className="text-xs text-gray-500 mt-1">
                  Número máximo de veces que se puede usar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-purple-900">
                Activar promoción inmediatamente
              </label>
              <p className="text-xs text-purple-700 ml-auto">
                La promoción estará disponible según las fechas configuradas
              </p>
            </div>
          </div>
        </BaseCard>

        {/* Product Selection */}
        <BaseCard title="Productos Aplicables">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-pink-200">
              <div className="w-8 h-8 bg-gradient-pink rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-pink-700" />
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  Seleccionar Productos
                </h3>
                <p className="text-sm text-gray-600">
                  Elige a qué productos se aplicará la promoción
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-700">
                  Productos disponibles ({pastries.length})
                </p>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {selectedItems.length === pastries.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pastries.map((pastry) => (
                  <div 
                    key={pastry.id} 
                    className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-sm ${
                      selectedItems.includes(pastry.id) 
                        ? 'border-pink-300 bg-pink-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleItemToggle(pastry.id)}
                  >
                    <input
                      id={`item-${pastry.id}`}
                      type="checkbox"
                      checked={selectedItems.includes(pastry.id)}
                      onChange={() => handleItemToggle(pastry.id)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pastry.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${pastry.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Seleccionados:</strong> {selectedItems.length} de {pastries.length} productos.
                  {selectedItems.length === 0 && ' Si no seleccionas ninguno, la promoción se aplicará a todos los productos.'}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        {/* Action Buttons */}
        <div className="card-base p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
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
              {loading ? 'Guardando...' : (promotion ? 'Actualizar Promoción' : 'Crear Promoción')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;