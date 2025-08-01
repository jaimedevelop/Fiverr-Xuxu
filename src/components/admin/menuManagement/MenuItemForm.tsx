import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import PhotoUpload from './PhotoUpload';
import AvailabilityToggle from './AvailabilityToggle';
import { X, Save, AlertCircle } from 'lucide-react';

const MenuItemForm = ({ item, categories, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [],
    available: true,
    availabilityMode: 'manual', // 'manual' or 'inventory'
    inventory: 0,
    tags: []
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form data when item prop changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price?.toString() || '',
        categoryId: item.categoryId || '',
        images: item.images || [],
        available: item.available !== undefined ? item.available : true,
        availabilityMode: item.availabilityMode || 'manual',
        inventory: item.inventory || 0,
        tags: item.tags || []
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        images: [],
        available: true,
        availabilityMode: 'manual',
        inventory: 0,
        tags: []
      });
    }
  }, [item, categories]);

  const validateForm = () => {
    const newErrors = {};
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del postre es obligatorio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Se requiere un precio válido';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'Se requiere al menos una imagen';
    }
    if (!formData.categoryId && categories.length > 0) {
      newErrors.categoryId = 'Por favor seleccione una categoría';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab('basic'); // Switch to basic tab to show errors
      return;
    }
    setSaving(true);
    try {
      const pastryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        images: formData.images,
        available: formData.available,
        availabilityMode: formData.availabilityMode,
        inventory: parseInt(formData.inventory) || 0,
        tags: formData.tags,
        updatedAt: new Date()
      };
      if (item) {
        // Update existing pastry
        await updateDoc(doc(db, 'pastries', item.id), pastryData);
      } else {
        // Create new pastry
        await addDoc(collection(db, 'pastries'), {
          ...pastryData,
          createdAt: new Date()
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving pastry:', error);
      alert('Error al guardar el postre. Por favor, inténtelo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const tabs = [
    { id: 'basic', label: 'Información Básica', hasError: !!(errors.name || errors.description || errors.price || errors.categoryId) },
    { id: 'images', label: 'Fotos', hasError: !!errors.images },
    { id: 'availability', label: 'Disponibilidad', hasError: false },
    { id: 'advanced', label: 'Avanzado', hasError: false }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {item ? 'Editar Postre' : 'Añadir Nuevo Postre'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {item ? 'Actualizar detalles y configuración del postre' : 'Crear un nuevo listado de postre para su menú'}
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.label}
                  {tab.hasError && (
                    <AlertCircle size={14} className="text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6">
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pastry Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Postre *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={saving}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="p.ej., Pastel de Chocolate, Tarta de Fresa"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio (MXN) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        disabled={saving}
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleChange('categoryId', e.target.value)}
                      disabled={saving}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.categoryId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                    )}
                    {categories.length === 0 && (
                      <p className="mt-1 text-sm text-orange-600">
                        No hay categorías disponibles. Cree categorías primero para organizar sus postres.
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={saving}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describa su postre - ingredientes, sabor, textura, características especiales..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Una buena descripción ayuda a los clientes a entender qué hace especial a su postre
                  </p>
                </div>
              </div>
            )}
            
            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Fotos del Postre</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Suba fotos de alta calidad de su postre. La primera imagen será la foto principal que se mostrará en los listados.
                  </p>
                </div>
                <PhotoUpload
                  images={formData.images}
                  onChange={(newImages) => handleChange('images', newImages)}
                  disabled={saving}
                />
                {errors.images && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="text-sm text-red-600">{errors.images}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración de Disponibilidad</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Controle cuándo los clientes pueden ver y pedir este postre
                  </p>
                </div>
                <AvailabilityToggle
                  pastry={{
                    ...formData,
                    id: 'temp' // Temporary ID for form
                  }}
                  compact={false}
                />
              </div>
            )}
            
            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración Avanzada</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Opciones adicionales y metadatos
                  </p>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="p.ej., sin gluten, vegano, cumpleaños, personalizado"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separe las etiquetas con comas. Estas ayudan con la búsqueda y filtrado.
                  </p>
                </div>
                
                {/* Inventory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inventario Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory}
                    onChange={(e) => handleChange('inventory', parseInt(e.target.value) || 0)}
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Establezca la cantidad inicial de stock para este postre
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              * Campos obligatorios
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {item ? 'Actualizar Postre' : 'Crear Postre'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;