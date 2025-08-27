import React, { useState, useEffect } from 'react';
import { Save, X, Package, DollarSign, Hash, Tag } from 'lucide-react';
import { InventoryWithDetails } from '../../../types/inventory';
import { getButtonClass, colors } from '../../../utils/themeHelper';
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
    <div className="card-base p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-saffron rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {item ? 'Editar Producto en Inventario' : 'Agregar Nuevo Producto'}
            </h2>
            <p className="text-sm text-gray-600">
              {item ? 'Actualiza la información del producto' : 'Completa los detalles del producto'}
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-emerald-200">
            <div className="w-8 h-8 bg-gradient-mint rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-900">
                Información del Producto
              </h3>
              <p className="text-sm text-gray-600">
                Selecciona el producto y su categoría
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="pastryId" className="block text-sm font-semibold text-gray-700 mb-2">
                Producto
              </label>
              <Select
                id="pastryId"
                name="pastryId"
                value={formData.pastryId || ''}
                onChange={handleSelectChange}
                options={pastryOptions}
                className="input-base"
                disabled={!!item} // Disable editing pastry for existing items
              />
              {errors.pastryId && <FormError message={errors.pastryId} />}
              {item && (
                <p className="text-xs text-gray-500 mt-1">
                  El producto no se puede cambiar en productos existentes
                </p>
              )}
            </div>

            <div>
              <label htmlFor="categoryName" className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <Select
                id="categoryName"
                name="categoryName"
                value={formData.categoryName || ''}
                onChange={handleSelectChange}
                options={categoryOptions}
                className="input-base"
              />
              {errors.categoryName && <FormError message={errors.categoryName} />}
            </div>
          </div>
        </div>

        {/* Stock Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-purple-200">
            <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-900">
                Configuración de Stock
              </h3>
              <p className="text-sm text-gray-600">
                Establece los niveles de inventario
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentStock" className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Actual
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="currentStock"
                  name="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock || ''}
                  onChange={handleInputChange}
                  className="pl-10 input-base"
                  placeholder="0"
                />
              </div>
              {errors.currentStock && <FormError message={errors.currentStock} />}
              <p className="text-xs text-gray-500 mt-1">
                Cantidad disponible actualmente
              </p>
            </div>

            <div>
              <label htmlFor="minimumStock" className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Mínimo
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="minimumStock"
                  name="minimumStock"
                  type="number"
                  min="0"
                  value={formData.minimumStock || ''}
                  onChange={handleInputChange}
                  className="pl-10 input-base"
                  placeholder="5"
                />
              </div>
              {errors.minimumStock && <FormError message={errors.minimumStock} />}
              <p className="text-xs text-gray-500 mt-1">
                Nivel mínimo antes de recibir alertas
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-pink-200">
            <div className="w-8 h-8 bg-gradient-pink rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-pink-700" />
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-900">
                Información de Precio
              </h3>
              <p className="text-sm text-gray-600">
                Establece el precio unitario del producto
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <label htmlFor="unitPrice" className="block text-sm font-semibold text-gray-700 mb-2">
              Precio Unitario (MXN)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice || ''}
                onChange={handleInputChange}
                className="pl-10 input-base"
                placeholder="0.00"
              />
            </div>
            {errors.unitPrice && <FormError message={errors.unitPrice} />}
            <p className="text-xs text-gray-500 mt-1">
              Precio por unidad en pesos mexicanos
            </p>
          </div>
        </div>

        {/* Stock Status Preview */}
        {formData.currentStock !== undefined && formData.minimumStock !== undefined && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Vista Previa del Estado</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">Stock actual: {formData.currentStock}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-gray-700">Stock mínimo: {formData.minimumStock}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  formData.currentStock <= 0 
                    ? 'bg-red-500' 
                    : formData.currentStock < formData.minimumStock 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`}></div>
                <span className="font-medium">
                  {formData.currentStock <= 0 
                    ? 'Agotado' 
                    : formData.currentStock < formData.minimumStock 
                      ? 'Stock bajo' 
                      : 'Stock normal'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className={getButtonClass('admin')}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : (item ? 'Actualizar Producto' : 'Guardar Producto')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;