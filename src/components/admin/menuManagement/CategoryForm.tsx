import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { X, Save, Palette } from 'lucide-react';
import { getButtonClass } from '../../../utils/themeHelper';

const CategoryForm = ({ category, onClose }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#8b5cf6',
    sortOrder: category?.sortOrder || 0
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const predefinedColors = [
    '#8b5cf6', // Purple (admin theme)
    '#F5CB5C', // Saffron (brand primary)
    '#10B981', // Emerald (success)
    '#EF4444', // Red (error)
    '#F59E0B', // Amber (warning)
    '#FF96D7', // Persian Pink (brand)
    '#3B82F6', // Sky (info)
    '#EC4899', // Rose (accent)
    '#06B6D4', // Cyan (cool)
    '#84CC16', // Lime (fresh)
    '#6366F1', // Indigo (deep)
    '#F43F5E', // Rose Red (bold)
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la categoría es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setSaving(true);
    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        sortOrder: parseInt(formData.sortOrder) || 0,
        updatedAt: new Date()
      };
      if (category) {
        // Update existing category
        await updateDoc(doc(db, 'categories', category.id), categoryData);
      } else {
        // Create new category
        await addDoc(collection(db, 'categories'), {
          ...categoryData,
          createdAt: new Date()
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría. Por favor, inténtelo de nuevo.');
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card-base max-w-lg w-full max-h-[90vh] overflow-hidden shadow-brand-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-main">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {category ? 'Actualizar detalles de la categoría' : 'Añadir una nueva categoría para organizar sus pasteles'}
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 hover:bg-white/50 p-2 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={saving}
              className={`input-base ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              placeholder="p.ej., Pasteles, Galletas, Panes"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center">!</span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={saving}
              rows={3}
              className="input-base"
              placeholder="Descripción opcional para esta categoría..."
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Color de la Categoría
            </label>
            
            {/* Color Preview */}
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
              <div 
                className="w-10 h-10 rounded-full shadow-md border-2 border-white"
                style={{ backgroundColor: formData.color }}
              />
              <div>
                <span className="text-sm font-medium text-gray-900">{formData.color}</span>
                <p className="text-xs text-gray-600">Color seleccionado</p>
              </div>
            </div>

            {/* Predefined Colors */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  disabled={saving}
                  className={`w-10 h-10 rounded-full border-2 hover:scale-110 transition-all duration-200 shadow-md ${
                    formData.color === color 
                      ? 'border-purple-400 shadow-lg ring-2 ring-purple-200' 
                      : 'border-white hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Palette size={18} className="text-purple-500" />
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                disabled={saving}
                className="w-12 h-8 border border-gray-300 rounded-lg cursor-pointer shadow-sm"
              />
              <span className="text-sm text-gray-600 font-medium">Color personalizado</span>
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Orden de Clasificación
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleChange('sortOrder', e.target.value)}
              disabled={saving}
              className="input-base"
              placeholder="0"
              min="0"
            />
            <p className="mt-2 text-xs text-gray-500">
              Los números más bajos aparecen primero en la lista
            </p>
          </div>

          {/* Preview */}
          <div className="card-base p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-dashed border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs flex items-center justify-center">👁</span>
              Vista previa:
            </p>
            <div className="flex items-center gap-3">
              <div 
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: formData.color }}
              />
              <span className="font-semibold text-gray-900">
                {formData.name || 'Nombre de la Categoría'}
              </span>
            </div>
            {formData.description && (
              <p className="text-sm text-gray-600 mt-2 ml-8">
                {formData.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`flex-1 ${getButtonClass('outline')} disabled:opacity-50`}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={saving || !formData.name.trim()}
              className={`flex-1 ${getButtonClass('admin')} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save size={16} />
                  {category ? 'Actualizar Categoría' : 'Crear Categoría'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;