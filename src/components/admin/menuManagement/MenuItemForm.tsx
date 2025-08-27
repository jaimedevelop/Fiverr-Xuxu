import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useUser } from '../../../contexts/UserContext';
import { useAuth } from '../../../contexts/AuthContext';
import PhotoUpload from './PhotoUpload';
import AvailabilityToggle from './AvailabilityToggle';
import { X, Save, AlertCircle } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

const MenuItemForm = ({ item, categories, onClose }) => {
  const { user } = useUser();
  const { logout } = useAuth();
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

  // Check for admin user with businessId on component mount
  useEffect(() => {
    console.log('🥐 MenuItemForm: Checking user permissions', {
      hasUser: !!user,
      userRole: user?.role,
      userBusinessId: user?.businessId
    });

    if (user?.role === 'admin' && !user.businessId) {
      console.error('❌ MenuItemForm: Admin user without businessId detected');
      alert('Error: Cuenta de administrador sin negocio asignado. Cerrando sesión...');
      setTimeout(() => {
        logout();
      }, 2000);
      return;
    }
  }, [user, logout]);

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
    
    // Check if user has businessId (additional safety check)
    if (!user?.businessId) {
      newErrors.general = 'Error: No se encontró el ID del negocio';
      setErrors(newErrors);
      return false;
    }
    
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

    // Final check for businessId
    if (!user?.businessId) {
      alert('Error: No se encontró el ID del negocio. Cerrando sesión...');
      logout();
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
        businessId: user.businessId, // Add businessId to pastry data
        updatedAt: new Date()
      };

      console.log('🥐 MenuItemForm: Saving pastry with businessId:', user.businessId);

      if (item) {
        // Update existing pastry
        await updateDoc(doc(db, 'pastries', item.id), pastryData);
        console.log('✅ MenuItemForm: Pastry updated successfully');
      } else {
        // Create new pastry
        await addDoc(collection(db, 'pastries'), {
          ...pastryData,
          createdAt: new Date()
        });
        console.log('✅ MenuItemForm: New pastry created successfully');
      }
      onClose();
    } catch (error) {
      console.error('❌ MenuItemForm: Error saving pastry:', error);
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

  // Don't render form if user doesn't have businessId
  if (user?.role === 'admin' && !user.businessId) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="card-base p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Error de Configuración</h2>
          <p className="text-gray-700 mb-6">
            Su cuenta de administrador no tiene un negocio asignado. Cerrando sesión...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Información Básica', hasError: !!(errors.name || errors.description || errors.price || errors.categoryId || errors.general) },
    { id: 'images', label: 'Fotos', hasError: !!errors.images },
    { id: 'availability', label: 'Disponibilidad', hasError: false },
    { id: 'advanced', label: 'Avanzado', hasError: false }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-base max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-brand-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-main">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {item ? 'Editar Postre' : 'Añadir Nuevo Postre'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {item ? 'Actualizar detalles y configuración del postre' : 'Crear un nuevo listado de postre para su menú'}
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 hover:bg-white/50 p-3 rounded-xl transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Error Alert */}
        {errors.general && (
          <div className="mx-8 mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-sm text-red-600 font-semibold">{errors.general}</p>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.label}
                  {tab.hasError && (
                    <AlertCircle size={16} className="text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-250px)]">
          <div className="p-8">
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pastry Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Nombre del Postre *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={saving}
                      className={`input-base ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      placeholder="p.ej., Pastel de Chocolate, Tarta de Fresa"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Precio (MXN) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        disabled={saving}
                        className={`input-base pl-10 ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.price}
                      </p>
                    )}
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Categoría
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleChange('categoryId', e.target.value)}
                      disabled={saving}
                      className={`input-base ${errors.categoryId ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.categoryId}
                      </p>
                    )}
                    {categories.length === 0 && (
                      <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        No hay categorías disponibles. Cree categorías primero para organizar sus postres.
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    disabled={saving}
                    rows={4}
                    className={`input-base ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="Describa su postre - ingredientes, sabor, textura, características especiales..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                    Una buena descripción ayuda a los clientes a entender qué hace especial a su postre
                  </p>
                </div>
              </div>
            )}
            
            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Fotos del Postre</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Suba fotos de alta calidad de su postre. La primera imagen será la foto principal que se mostrará en los listados.
                  </p>
                </div>
                <PhotoUpload
                  images={formData.images}
                  onChange={(newImages) => handleChange('images', newImages)}
                  disabled={saving}
                />
                {errors.images && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={20} className="text-red-600" />
                      <p className="text-sm text-red-600 font-semibold">{errors.images}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Configuración de Disponibilidad</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
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
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Configuración Avanzada</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Opciones adicionales y metadatos
                  </p>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Etiquetas
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                    disabled={saving}
                    className="input-base"
                    placeholder="p.ej., sin gluten, vegano, cumpleaños, personalizado"
                  />
                  <p className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                    Separe las etiquetas con comas. Estas ayudan con la búsqueda y filtrado.
                  </p>
                </div>
                
                {/* Inventory */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Inventario Inicial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory}
                    onChange={(e) => handleChange('inventory', parseInt(e.target.value) || 0)}
                    disabled={saving}
                    className="input-base"
                    placeholder="0"
                  />
                  <p className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                    Establezca la cantidad inicial de stock para este postre
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="px-8 py-6 bg-gradient-main border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">
              * Campos obligatorios
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className={`${getButtonClass('outline')} disabled:opacity-50`}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className={`${getButtonClass('admin')} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={16} />
                    {item ? 'Actualizar Postre' : 'Crear Postre'}
                  </span>
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