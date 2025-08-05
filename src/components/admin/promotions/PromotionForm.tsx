import React, { useState, useEffect } from 'react';
import { Save, X, Tag, Calendar, Percent } from 'lucide-react';
import Button from '../../../components/ui/Button';
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
        return 'Porcentaje de Descuento';
      case 'fixed_amount':
        return 'Monto de Descuento ($)';
      case 'buy_one_get_one':
        return 'No aplica';
      case 'free_shipping':
        return 'Monto Mínimo para Envío Gratis ($)';
      default:
        return 'Valor';
    }
  };

  const getValuePlaceholder = () => {
    switch (formData.type) {
      case 'percentage':
        return 'Ej: 20';
      case 'fixed_amount':
        return 'Ej: 50';
      case 'free_shipping':
        return 'Ej: 300';
      default:
        return 'Ingrese un valor';
    }
  };

  return (
    <BaseCard title={promotion ? 'Editar Promoción' : 'Nueva Promoción'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Promoción
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.title && <FormError message={errors.title} />}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Promoción
            </label>
            <Select
              id="type"
              name="type"
              value={formData.type || 'percentage'}
              onChange={handleSelectChange}
              options={promotionTypeOptions}
              className="w-full"
            />
            {errors.type && <FormError message={errors.type} />}
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              {getValueLabel()}
            </label>
            <Input
              id="value"
              name="value"
              type="number"
              min="0"
              step={formData.type === 'percentage' ? '1' : '0.01'}
              value={formData.value || ''}
              onChange={handleInputChange}
              className="w-full"
              placeholder={getValuePlaceholder()}
              disabled={formData.type === 'buy_one_get_one'}
            />
            {errors.value && <FormError message={errors.value} />}
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Código de Promoción (Opcional)
            </label>
            <Input
              id="code"
              name="code"
              value={formData.code || ''}
              onChange={handleInputChange}
              className="w-full"
              placeholder="Ej: VERANO20"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className="w-full"
            />
            {errors.startDate && <FormError message={errors.startDate} />}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Fin
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              className="w-full"
            />
            {errors.endDate && <FormError message={errors.endDate} />}
          </div>

          <div>
            <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-1">
              Límite de Uso
            </label>
            <Input
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              value={formData.usageLimit || ''}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.usageLimit && <FormError message={errors.usageLimit} />}
          </div>

          <div>
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
                Promoción Activa
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.description && <FormError message={errors.description} />}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Productos Aplicables
            </label>
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="mb-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedItems.length === pastries.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pastries.map((pastry) => (
                  <div key={pastry.id} className="flex items-center">
                    <input
                      id={`item-${pastry.id}`}
                      type="checkbox"
                      checked={selectedItems.includes(pastry.id)}
                      onChange={() => handleItemToggle(pastry.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`item-${pastry.id}`} className="ml-2 text-sm text-gray-700">
                      {pastry.name}
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Selecciona los productos a los que se aplicará esta promoción.
                Si no seleccionas ninguno, la promoción se aplicará a todos los productos.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Promoción'}
          </Button>
        </div>
      </form>
    </BaseCard>
  );
};

export default PromotionForm;