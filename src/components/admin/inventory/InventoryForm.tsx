import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { InventoryWithDetails } from '../../../types/inventory';
import Button from '../../../components/ui/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/ui/Select';
import FormError from '../../../components/common/FormError';

interface InventoryFormProps {
  item?: InventoryWithDetails;
  onSave: (item: Partial<InventoryWithDetails>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ 
  item, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<Partial<InventoryWithDetails>>({
    pastryId: '',
    currentStock: 0,
    minimumStock: 5,
    unitPrice: 0,
    pastryName: '',
    categoryName: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        businessId: item.businessId,
        pastryId: item.pastryId,
        currentStock: item.currentStock,
        minimumStock: item.minimumStock,
        unitPrice: item.unitPrice,
        pastryName: item.pastryName,
        categoryName: item.categoryName,
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.pastryId) {
      newErrors.pastryId = 'Selecciona un producto';
    }
    
    if (formData.currentStock === undefined || formData.currentStock < 0) {
      newErrors.currentStock = 'El stock actual debe ser un número positivo';
    }
    
    if (formData.minimumStock === undefined || formData.minimumStock < 0) {
      newErrors.minimumStock = 'El stock mínimo debe ser un número positivo';
    }
    
    if (formData.unitPrice === undefined || formData.unitPrice < 0) {
      newErrors.unitPrice = 'El precio debe ser un número positivo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pastryId' || name === 'pastryName' || name === 'categoryName' 
        ? value 
        : Number(value)
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

  // Mock data for pastries and categories
  const pastryOptions = [
    { value: 'pastry1', label: 'Croissant de Chocolate' },
    { value: 'pastry2', label: 'Concha' },
    { value: 'pastry3', label: 'Pastel de Chocolate' },
    { value: 'pastry4', label: 'Donut' },
    { value: 'pastry5', label: 'Empanada de Pollo' },
  ];

  const categoryOptions = [
    { value: 'cat1', label: 'Panadería' },
    { value: 'cat2', label: 'Repostería' },
    { value: 'cat3', label: 'Salados' },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          {item ? 'Editar producto' : 'Agregar producto'}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="pastryId" className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <Select
              id="pastryId"
              name="pastryId"
              value={formData.pastryId || ''}
              onChange={handleSelectChange}
              options={pastryOptions}
              className="w-full"
              disabled={!!item} // Disable editing pastry for existing items
            />
            {errors.pastryId && <FormError message={errors.pastryId} />}
          </div>

          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <Select
              id="categoryName"
              name="categoryName"
              value={formData.categoryName || ''}
              onChange={handleSelectChange}
              options={categoryOptions}
              className="w-full"
            />
            {errors.categoryName && <FormError message={errors.categoryName} />}
          </div>

          <div>
            <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Actual
            </label>
            <Input
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              value={formData.currentStock || ''}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.currentStock && <FormError message={errors.currentStock} />}
          </div>

          <div>
            <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Mínimo
            </label>
            <Input
              id="minimumStock"
              name="minimumStock"
              type="number"
              min="0"
              value={formData.minimumStock || ''}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.minimumStock && <FormError message={errors.minimumStock} />}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Precio Unitario
            </label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice || ''}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.unitPrice && <FormError message={errors.unitPrice} />}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;