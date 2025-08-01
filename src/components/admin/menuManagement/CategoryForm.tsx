import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { X, Save, Palette } from 'lucide-react';

const CategoryForm = ({ category, onClose }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6',
    sortOrder: category?.sortOrder || 0
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const predefinedColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F43F5E', // Rose
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
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {category ? 'Actualizar detalles de la categoría' : 'Añadir una nueva categoría para organizar sus pasteles'}
            </p>
          </div>
          
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={saving}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="p.ej., Pasteles, Galletas, Panes"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={saving}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción opcional para esta categoría..."
            />
          </div>
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de la Categoría
            </label>
            
            {/* Color Preview */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm text-gray-600">{formData.color}</span>
            </div>
            {/* Predefined Colors */}
            <div className="grid grid-cols-6 gap-2 mb-3">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  disabled={saving}
                  className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                    formData.color === color ? 'border-gray-400 shadow-md' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            {/* Custom Color Input */}
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-gray-400" />
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                disabled={saving}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-xs text-gray-500">Color personalizado</span>
            </div>
          </div>
          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orden de Clasificación
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleChange('sortOrder', e.target.value)}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Los números más bajos aparecen primero en la lista
            </p>
          </div>
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: formData.color }}
              />
              <span className="font-medium">
                {formData.name || 'Nombre de la Categoría'}
              </span>
            </div>
            {formData.description && (
              <p className="text-sm text-gray-600 mt-1 ml-7">
                {formData.description}
              </p>
            )}
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={saving || !formData.name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {category ? 'Actualizar Categoría' : 'Crear Categoría'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;  